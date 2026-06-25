/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { LiveAnalytics } from "../features/landing/types";

const MOCK_ANALYTICS: LiveAnalytics = {
  todaySales: 12845.5,
  percentageGrowth: 18.2,
  featuredProduct: {
    name: "Smart Terminal",
    price: 299.99,
    salesIncrease: 25,
  },
  aiSuggestion: {
    amount: 45.0,
  },
};

export const analyticsService = {
  getLiveAnalytics: async (): Promise<LiveAnalytics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ANALYTICS);
      }, 300);
    });
  },
};
