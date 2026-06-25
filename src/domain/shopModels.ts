/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageFileIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
