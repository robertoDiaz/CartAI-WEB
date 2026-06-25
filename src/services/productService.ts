/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { Product } from "../domain/product";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Cart•AI Smart Terminal",
    description: "Terminal inteligente de punto de venta con recomendaciones por IA en tiempo real y pantalla táctil HD.",
    price: 299.99,
    stock: 5,
    imageFileIds: [],
  },
  {
    id: "prod-2",
    name: "Predictive Stock Tracker",
    description: "Sensor IoT ultrapreciso para estanterías que predice la rotura de stock y automatiza pedidos.",
    price: 149.50,
    stock: 3,
    imageFileIds: [],
  },
  {
    id: "prod-3",
    name: "Automated Cart Tag",
    description: "Etiqueta digital inteligente de tinta electrónica para carritos de compra que sincroniza precios dinámicos.",
    price: 19.99,
    stock: 15,
    imageFileIds: [],
  },
  {
    id: "prod-4",
    name: "Hexagonal Hub Gateway",
    description: "Servidor de comunicación local con arquitectura hexagonal redundante y encriptación de grado militar.",
    price: 599.00,
    stock: 2,
    imageFileIds: [],
  },
  {
    id: "prod-5",
    name: "Hexagonal Hub Gateway 2",
    description: "Servidor de comunicación remoto con arquitectura hexagonal redundante y encriptación de grado militar.",
    price: 1000.00,
    stock: 0,
    imageFileIds: [],
  },
];

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    // Simulamos un retraso de red de 400ms para emular una API real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PRODUCTS);
      }, 400);
    });
  },
};
