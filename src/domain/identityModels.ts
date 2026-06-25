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
}

export interface AuthRestResponse {
  userId: string;
  token: string;
  email: string;
  name: string;
  roles: string[];
  avatarFileId?: string;
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

export interface UpdateUserRestRequest {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatarFileId?: string;
}

