/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useIdentityStore } from "../../../features/identity/identityStore";
import { identityService } from "../../../features/identity/identityService";

// Mock the identity service
vi.mock("../../../features/identity/identityService", () => ({
  identityService: {
    login: vi.fn(),
    register: vi.fn(),
    uploadAvatar: vi.fn(),
    updateUser: vi.fn(),
  },
}));

describe("useIdentityStore", () => {
  beforeEach(() => {
    // Reset store state
    useIdentityStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("should successfully log in and update state", async () => {
    const mockResponse = {
      userId: "user-id-123",
      token: "mock-jwt-token",
      email: "test@example.com",
      name: "Test User",
      roles: ["USER"],
    };

    vi.mocked(identityService.login).mockResolvedValueOnce(mockResponse);

    const store = useIdentityStore.getState();
    await store.login({ email: "test@example.com", password: "password123" });

    const updatedStore = useIdentityStore.getState();
    expect(updatedStore.isAuthenticated).toBe(true);
    expect(updatedStore.token).toBe("mock-jwt-token");
    expect(updatedStore.user?.id).toBe("user-id-123");
    expect(updatedStore.user?.email).toBe("test@example.com");
    expect(updatedStore.error).toBeNull();
  });

  it("should handle login errors and set error state", async () => {
    const mockError = {
      response: { data: { message: "Invalid credentials" } },
    };

    vi.mocked(identityService.login).mockRejectedValueOnce(mockError);

    const store = useIdentityStore.getState();
    
    // Attempt login and catch expected error
    await expect(store.login({ email: "test@example.com", password: "wrong" })).rejects.toThrow();

    const updatedStore = useIdentityStore.getState();
    expect(updatedStore.isAuthenticated).toBe(false);
    expect(updatedStore.token).toBeNull();
    expect(updatedStore.error).toBe("Invalid credentials");
  });

  it("should successfully update profile and update user in state", async () => {
    const initialUser = {
      id: "user-id-123",
      email: "test@example.com",
      name: "Test User",
      roles: ["USER"],
    };
    useIdentityStore.setState({
      user: initialUser,
      token: "mock-jwt-token",
      isAuthenticated: true,
    });

    const updatedUserResponse = {
      id: "user-id-123",
      email: "updated@example.com",
      name: "Updated User",
      roles: ["USER"],
      avatarFileId: "avatar-file-id-456",
    };

    vi.mocked(identityService.updateUser).mockResolvedValueOnce(updatedUserResponse);

    const store = useIdentityStore.getState();
    await store.updateProfile({
      id: "user-id-123",
      name: "Updated User",
      email: "updated@example.com",
      roles: ["USER"],
      avatarFileId: "avatar-file-id-456",
    });

    const updatedStore = useIdentityStore.getState();
    expect(updatedStore.user?.name).toBe("Updated User");
    expect(updatedStore.user?.email).toBe("updated@example.com");
    expect(updatedStore.user?.avatarFileId).toBe("avatar-file-id-456");
  });

  it("should successfully log out and clear state", () => {
    // Setup initial authenticated state
    useIdentityStore.setState({
      user: { id: "user-id-123", email: "test@example.com", name: "Test User", roles: [] },
      token: "existing-token",
      isAuthenticated: true,
    });

    const store = useIdentityStore.getState();
    store.logout();

    const updatedStore = useIdentityStore.getState();
    expect(updatedStore.isAuthenticated).toBe(false);
    expect(updatedStore.token).toBeNull();
    expect(updatedStore.user).toBeNull();
  });
});
