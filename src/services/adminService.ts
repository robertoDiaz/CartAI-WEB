/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { apiClient } from "./apiClient";
import type { User, Role, CreateRoleRequest, CreateUserRequest, UpdateUserRequest } from "../domain/identityModels";

export const adminService = {
  // Users management
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/api/users");
    return response.data;
  },

  async createUser(request: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>("/api/users", request);
    return response.data;
  },

  async updateUser(id: string, request: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/api/users/${id}`, request);
    return response.data;
  },

  async deleteUser(id: string): Promise<User> {
    const response = await apiClient.delete<User>(`/api/users/${id}`);
    return response.data;
  },

  // Roles management
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>("/api/roles");
    return response.data;
  },

  async createRole(request: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<Role>("/api/roles", request);
    return response.data;
  },

  async deleteRole(id: string): Promise<Role> {
    const response = await apiClient.delete<Role>(`/api/roles/${id}`);
    return response.data;
  },
};
