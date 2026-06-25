/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

export interface LiveAnalytics {
  todaySales: number;
  percentageGrowth: number;
  featuredProduct: {
    name: string;
    price: number;
    salesIncrease: number;
  };
  aiSuggestion: {
    amount: number;
  };
}
