/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { SessionTimeoutWatcher } from "../../components/layout/SessionTimeoutWatcher";
import { useIdentityStore } from "../../features/identity/identityStore";
import { useToastStore } from "../../components/ui/useToastStore";

// Mock i18next without default value parameters
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, arg2?: any, arg3?: any) => {
      const options = typeof arg2 === "object" ? arg2 : arg3;
      if (key === "auth.sessionWarning" && options && options.seconds !== undefined) {
        return `Tu sesión va a caducar en ${options.seconds} segundos.`;
      }
      if (key === "auth.sessionExpired") {
        return "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.";
      }
      if (key === "auth.extendSession") {
        return "Ampliar sesión";
      }
      return key;
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

const createFakeToken = (expiresInSeconds: number) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    userId: "user-123",
    email: "test@test.com",
  };
  const base64Payload = btoa(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `header.${base64Payload}.signature`;
};

describe("SessionTimeoutWatcher component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
    useIdentityStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should do nothing if no token is present", () => {
    const logoutSpy = vi.spyOn(useIdentityStore.getState(), "logout");
    render(<SessionTimeoutWatcher />);

    // Advance time and check that logout was not called and no toast was added
    vi.advanceTimersByTime(10000);
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it("should logout immediately if token is already expired and show sessionExpired toast", () => {
    const logoutSpy = vi.spyOn(useIdentityStore.getState(), "logout");
    const expiredToken = createFakeToken(-10); // Expired 10 seconds ago
    useIdentityStore.setState({ token: expiredToken });

    render(<SessionTimeoutWatcher />);

    expect(logoutSpy).toHaveBeenCalled();
    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe("error");
    expect(toasts[0].message).toBe("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
  });

  it("should schedule a warning timer and trigger warning toast when 60s remaining", async () => {
    const token = createFakeToken(300); // 5 minutes remaining
    useIdentityStore.setState({ token });

    render(<SessionTimeoutWatcher />);

    // No warning toast initially
    expect(useToastStore.getState().toasts.length).toBe(0);

    // Advance time by 4 minutes (240 seconds) -> 60 seconds left
    await act(async () => {
      vi.advanceTimersByTime(240000);
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe("warning");
    expect(toasts[0].message).toContain("60 segundos");
  });

  it("should show warning toast immediately if token has less than 60s remaining", () => {
    const token = createFakeToken(45); // 45 seconds remaining
    useIdentityStore.setState({ token });

    render(<SessionTimeoutWatcher />);

    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toContain("45 segundos");
  });

  it("should update toast message countdown every second and logout + show expired toast when time expires", async () => {
    const logoutSpy = vi.spyOn(useIdentityStore.getState(), "logout");
    const token = createFakeToken(5); // 5 seconds remaining
    useIdentityStore.setState({ token });

    render(<SessionTimeoutWatcher />);

    expect(useToastStore.getState().toasts[0].message).toContain("5 segundos");

    // Advance by 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(useToastStore.getState().toasts[0].message).toContain("4 segundos");

    // Advance by 4 more seconds
    await act(async () => {
      vi.advanceTimersByTime(4000);
    });

    expect(logoutSpy).toHaveBeenCalled();
    const toasts = useToastStore.getState().toasts;
    // The warning toast is cleared, and the error "session expired" toast is added
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe("error");
    expect(toasts[0].message).toBe("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
  });

  it("should call refreshToken when clicking extend session action button", async () => {
    const refreshTokenSpy = vi.spyOn(useIdentityStore.getState(), "refreshToken").mockResolvedValue();
    const token = createFakeToken(30); // 30 seconds remaining
    useIdentityStore.setState({ token });

    render(<SessionTimeoutWatcher />);

    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);

    const action = toasts[0].action;
    expect(action).toBeDefined();
    expect(action?.label).toBe("Ampliar sesión");

    // Click extend session action
    await act(async () => {
      action?.onClick();
    });

    expect(refreshTokenSpy).toHaveBeenCalled();
  });
});
