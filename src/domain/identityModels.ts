/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatarFileId?: string;
  phone?: string;
  taxId?: string;
  preferredLanguage?: string;
}

export interface AuthRestResponse {
  userId: string;
  token: string;
  email: string;
  name: string;
  roles: string[];
  avatarFileId?: string;
  phone?: string;
  taxId?: string;
  preferredLanguage?: string;
}

export interface LoginRestRequest {
  email: string;
  password?: string;
}

export interface RegisterRestRequest {
  name: string;
  email: string;
  password?: string;
  avatarFileId?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export type CreateRoleRequest = Omit<Role, "id">;

export interface CreateUserRequest extends Pick<User, "name" | "email" | "roles"> {
  password?: string;
}

export interface UpdateUserRequest extends Omit<User, "email"> {
  oldPassword?: string;
  newPassword?: string;
}

// Backwards compatibility alias
export type UpdateUserRestRequest = UpdateUserRequest;
