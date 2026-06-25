/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

export interface User {
  email: string;
  name: string;
  roles: string[];
}

export interface AuthRestResponse {
  token: string;
  email: string;
  name: string;
  roles: string[];
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
