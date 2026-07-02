/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SystemErrorScreen } from "../../components/layout/SystemErrorScreen";
import { useSystemErrorStore } from "../../services/systemErrorStore";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === "system.errorTitle") return "Servidor no disponible";
      if (key === "system.errorDescription") return "No hemos podido establecer conexión con el servidor de Cart•AI. Por favor, comprueba tu conexión a internet o inténtalo de nuevo en unos minutos.";
      if (key === "system.errorRetry") return "Reintentar conexión";
      return key;
    },
  }),
}));

describe("SystemErrorScreen component", () => {
  let fetchSpy: any;

  beforeEach(() => {
    // Enable fake timers for interval polling tests
    vi.useFakeTimers();

    // Reset store state
    useSystemErrorStore.setState({
      hasSystemError: true,
      pollingInterval: 10,
    });

    // Mock global fetch
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render error screen with text and retry button", () => {
    render(<SystemErrorScreen />);

    expect(screen.getByText("Servidor no disponible")).toBeInTheDocument();
    expect(
      screen.getByText(
        "No hemos podido establecer conexión con el servidor de Cart•AI. Por favor, comprueba tu conexión a internet o inténtalo de nuevo en unos minutos."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reintentar conexión/i })).toBeInTheDocument();
  });

  it("should attempt connection check and keep error state if server is offline", async () => {
    // Mock fetch to simulate offline server (failure)
    fetchSpy.mockRejectedValueOnce(new Error("Network Error"));

    render(<SystemErrorScreen />);

    const retryBtn = screen.getByRole("button", { name: /Reintentar conexión/i });
    
    // Click retry
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    // Verify fetch was called with products endpoint
    expect(fetchSpy).toHaveBeenCalled();
    // System error should remain true
    expect(useSystemErrorStore.getState().hasSystemError).toBe(true);
  });

  it("should clear error state if retry succeeds and server is online", async () => {
    // Mock fetch to simulate online server (success)
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    render(<SystemErrorScreen />);

    const retryBtn = screen.getByRole("button", { name: /Reintentar conexión/i });
    
    // Click retry
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    // System error should now be false
    expect(useSystemErrorStore.getState().hasSystemError).toBe(false);
  });

  it("should automatically poll and recover when server becomes online", async () => {
    // Setup fetch mock for the auto-check to succeed
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    render(<SystemErrorScreen />);

    expect(useSystemErrorStore.getState().hasSystemError).toBe(true);

    // Advance fake timers by the polling interval (10 seconds)
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Wait for the async code/promise within checkConnection to resolve
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    // Verify it automatically recovered and cleared the error state
    expect(useSystemErrorStore.getState().hasSystemError).toBe(false);
  });
});
