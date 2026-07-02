/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type {
  AuthRestResponse,
  LoginRestRequest,
  RegisterRestRequest,
  UpdateUserRestRequest,
  User,
} from "../domain/identityModels";
import { apiClient } from "./apiClient";

export const identityService = {
  login: async (request: LoginRestRequest): Promise<AuthRestResponse> => {
    const response = await apiClient.post<AuthRestResponse>(
      "/api/auth/login",
      request,
    );
    return response.data;
  },

  register: async (request: RegisterRestRequest): Promise<AuthRestResponse> => {
    const response = await apiClient.post<AuthRestResponse>(
      "/api/auth/register",
      request,
    );
    return response.data;
  },

  uploadAvatar: async (userId: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.put<User>(
      `/api/users/avatar/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return response.data;
  },

  updateUser: async (
    id: string,
    request: UpdateUserRestRequest,
  ): Promise<User> => {
    const response = await apiClient.put<User>(`/api/users/${id}`, request);
    return response.data;
  },

  refreshToken: async (): Promise<AuthRestResponse> => {
    const response = await apiClient.post<AuthRestResponse>("/api/auth/refresh");
    return response.data;
  },
};
