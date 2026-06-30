/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

export interface Address {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  zipCode: string;
  phone?: string;
  state?: string;
  country: string;
  notes?: string;
  isDefault: boolean;
}

export interface AddressRestRequest {
  alias: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  zipCode: string;
  phone?: string;
  state?: string;
  country: string;
  notes?: string;
  isDefault: boolean;
}
