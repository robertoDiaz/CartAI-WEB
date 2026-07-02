/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToastStore } from "../../../components/ui/useToastStore";
import { addressService } from "../../../services/addressService";
import type { Address, AddressRestRequest } from "../../../domain/addressModels";

export interface AddressFormProps {
  alias: string;
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  state: string;
  country: string;
  notes: string;
  isDefault: boolean;
}

export function useProfileAddresses(user: any, activeTab: string) {
  const { t: translate } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [form, setForm] = useState<AddressFormProps>({
    alias: "",
    firstName: "",
    lastName: "",
    company: "",
    street: "",
    city: "",
    zipCode: "",
    phone: "",
    state: "",
    country: "",
    notes: "",
    isDefault: false,
  });

  const loadAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const data = await addressService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("profile.errorLoadingAddresses"), "error");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === "addresses" && user) {
      loadAddresses();
    }
  }, [activeTab, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: boolean }) => {
    if ('target' in e) {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [e.name]: e.value,
      }));
    }
  };

  const onOpenAddAddressModal = () => {
    setEditingAddress(null);
    setForm({
      alias: "",
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      city: "",
      zipCode: "",
      phone: "",
      state: "",
      country: "",
      notes: "",
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  const onOpenEditAddressModal = (addr: Address) => {
    setEditingAddress(addr);
    setForm({
      alias: addr.alias || "",
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      company: addr.company || "",
      street: addr.street || "",
      city: addr.city || "",
      zipCode: addr.zipCode || "",
      phone: addr.phone || "",
      state: addr.state || "",
      country: addr.country || "",
      notes: addr.notes || "",
      isDefault: !!addr.isDefault,
    });
    setShowAddressModal(true);
  };

  const onCloseAddressModal = () => {
    setShowAddressModal(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const request: AddressRestRequest = {
      alias: form.alias,
      firstName: form.firstName,
      lastName: form.lastName,
      company: form.company,
      street: form.street,
      city: form.city,
      zipCode: form.zipCode,
      phone: form.phone,
      state: form.state,
      country: form.country,
      notes: form.notes,
      isDefault: form.isDefault,
    };

    try {
      if (editingAddress) {
        await addressService.updateAddress(user.id, editingAddress.id, request);
      } else {
        await addressService.addAddress(user.id, request);
      }
      onCloseAddressModal();
      loadAddresses();
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast(translate("profile.errorSavingAddress"), "error");
    }
  };

  const onDeleteAddress = async (addrId: string) => {
    if (!user) return;
    if (confirm(translate("profile.confirmDeleteAddress"))) {
      try {
        await addressService.deleteAddress(user.id, addrId);
        loadAddresses();
      } catch (err) {
        console.error(err);
        useToastStore.getState().addToast(translate("profile.errorDeletingAddress"), "error");
      }
    }
  };

  return {
    addresses,
    loadingAddresses,
    showAddressModal,
    onOpenAddAddressModal,
    onOpenEditAddressModal,
    onCloseAddressModal,
    onSubmit,
    onDeleteAddress,
    form,
    onChange,
    editingAddress,
  };
}
