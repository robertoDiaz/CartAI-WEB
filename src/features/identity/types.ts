/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { LoginRestRequest, RegisterRestRequest, UpdateUserRestRequest, User } from "../../domain/identityModels";

export interface IdentityState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (request: LoginRestRequest) => Promise<void>;
  register: (request: RegisterRestRequest) => Promise<void>;
  updateProfile: (request: UpdateUserRestRequest) => Promise<void>;
  uploadAvatar: (userId: string, file: File) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
