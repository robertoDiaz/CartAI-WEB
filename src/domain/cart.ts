/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}
