/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import type { Address, AddressRestRequest } from "../../domain/addressModels";
import { apiClient } from "../../services/apiClient";

export const addressService = {
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>(`/api/users/${userId}/addresses`);
    return response.data;
  },

  addAddress: async (userId: string, request: AddressRestRequest): Promise<Address> => {
    const response = await apiClient.post<Address>(`/api/users/${userId}/addresses`, request);
    return response.data;
  },

  updateAddress: async (userId: string, addressId: string, request: AddressRestRequest): Promise<Address> => {
    const response = await apiClient.put<Address>(`/api/users/${userId}/addresses/${addressId}`, request);
    return response.data;
  },

  deleteAddress: async (userId: string, addressId: string): Promise<void> => {
    await apiClient.delete(`/api/users/${userId}/addresses/${addressId}`);
  },
};
