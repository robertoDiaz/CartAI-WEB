/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type {
  AuthRestResponse,
  LoginRestRequest,
  RegisterRestRequest,
} from "../../domain/identityModels";
import { apiClient } from "../../services/apiClient";

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
};
