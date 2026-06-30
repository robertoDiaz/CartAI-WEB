/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { apiClient } from "../../services/apiClient";

export const settingsService = {
  getLanguages: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/api/settings/languages");
    return response.data;
  },
};
