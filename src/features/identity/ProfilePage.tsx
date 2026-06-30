/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import {
  AlertCircle,
  CheckCircle2,
  LogOut,
  Mail,
  Save,
  Shield,
  Upload,
  User as UserIcon,
  Key,
  X,
  Phone,
  CreditCard,
  Globe,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useIdentityStore } from "./identityStore";
import { settingsService } from "../settings/settingsService";
import { addressService } from "./addressService";
import type { Address, AddressRestRequest } from "../../domain/addressModels";

export function ProfilePage() {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    updateProfile,
    logout,
    error,
    clearError,
    isLoading,
    uploadAvatar,
  } = useIdentityStore();

  const [activeTab, setActiveTab] = useState<"general" | "addresses">("general");

  // General tab states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [taxId, setTaxId] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [localError, setLocalError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingPassword, setPendingPassword] = useState<{old: string, new: string} | null>(null);
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [repeatPasswordInput, setRepeatPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Addresses tab states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Address form states
  const [addrAlias, setAddrAlias] = useState("");
  const [addrFirstName, setAddrFirstName] = useState("");
  const [addrLastName, setAddrLastName] = useState("");
  const [addrCompany, setAddrCompany] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrZipCode, setAddrZipCode] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrCountry, setAddrCountry] = useState("");
  const [addrNotes, setAddrNotes] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Redirect if not authenticated and init general states
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setTaxId(user.taxId || "");
      setPreferredLanguage(user.preferredLanguage || "");
      
      if (user.avatarFileId) {
        setPreviewUrl(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${user.avatarFileId}`,
        );
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch languages
  useEffect(() => {
    settingsService.getLanguages().then(setLanguages).catch(console.error);
  }, []);

  // Fetch addresses when tab changes
  useEffect(() => {
    if (activeTab === "addresses" && user) {
      loadAddresses();
    }
  }, [activeTab, user]);

  const loadAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const data = await addressService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error(err);
      setLocalError(translate("profile.errorLoadingAddresses"));
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);
    setLocalError("");
    setSuccessMsg("");

    try {
      if (!user) return;
      await uploadAvatar(user.id, file);
      setSuccessMsg(translate("profile.uploadSuccess"));
    } catch (err: any) {
      setLocalError(translate("profile.uploadError"));
      if (user?.avatarFileId) {
        setPreviewUrl(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/storage/files/${user.avatarFileId}`,
        );
      } else {
        setPreviewUrl("");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLocalError("");
    setSuccessMsg("");
    clearError();

    try {
      await updateProfile({
        id: user.id,
        name,
        roles: user.roles,
        avatarFileId: user.avatarFileId || undefined,
        oldPassword: pendingPassword?.old,
        newPassword: pendingPassword?.new,
        phone,
        taxId,
        preferredLanguage
      });
      setSuccessMsg(translate("profile.success"));
      setPendingPassword(null);
    } catch (err: any) {
      // Error will be shown via store error
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePasswordModalOk = () => {
    if (!oldPasswordInput || !newPasswordInput || !repeatPasswordInput) {
      setPasswordError(translate("profile.errorAllFields"));
      return;
    }
    if (newPasswordInput !== repeatPasswordInput) {
      setPasswordError(translate("profile.errorMismatch"));
      return;
    }
    setPendingPassword({ old: oldPasswordInput, new: newPasswordInput });
    setShowPasswordModal(false);
    setOldPasswordInput("");
    setNewPasswordInput("");
    setRepeatPasswordInput("");
    setPasswordError("");
  };

  const handlePasswordModalCancel = () => {
    setShowPasswordModal(false);
    setOldPasswordInput("");
    setNewPasswordInput("");
    setRepeatPasswordInput("");
    setPasswordError("");
  };

  // Address Modal logic
  const openAddAddressModal = () => {
    setEditingAddress(null);
    setAddrAlias("");
    setAddrFirstName("");
    setAddrLastName("");
    setAddrCompany("");
    setAddrStreet("");
    setAddrCity("");
    setAddrZipCode("");
    setAddrPhone("");
    setAddrState("");
    setAddrCountry("");
    setAddrNotes("");
    setAddrIsDefault(false);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (addr: Address) => {
    setEditingAddress(addr);
    setAddrAlias(addr.alias);
    setAddrFirstName(addr.firstName);
    setAddrLastName(addr.lastName);
    setAddrCompany(addr.company || "");
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrZipCode(addr.zipCode);
    setAddrPhone(addr.phone || "");
    setAddrState(addr.state || "");
    setAddrCountry(addr.country);
    setAddrNotes(addr.notes || "");
    setAddrIsDefault(addr.isDefault);
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const request: AddressRestRequest = {
      alias: addrAlias,
      firstName: addrFirstName,
      lastName: addrLastName,
      company: addrCompany,
      street: addrStreet,
      city: addrCity,
      zipCode: addrZipCode,
      phone: addrPhone,
      state: addrState,
      country: addrCountry,
      notes: addrNotes,
      isDefault: addrIsDefault
    };

    try {
      if (editingAddress) {
        await addressService.updateAddress(user.id, editingAddress.id, request);
      } else {
        await addressService.addAddress(user.id, request);
      }
      setShowAddressModal(false);
      loadAddresses();
    } catch (err) {
      console.error(err);
      setLocalError(translate("profile.errorSavingAddress"));
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!user) return;
    if (confirm(translate("profile.confirmDeleteAddress"))) {
      try {
        await addressService.deleteAddress(user.id, addrId);
        loadAddresses();
      } catch (err) {
        console.error(err);
        setLocalError(translate("profile.errorDeletingAddress"));
      }
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 relative">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[--color-brand-primary] to-slate-800 px-8 py-10 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserIcon className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight relative z-10">
            {translate("profile.title")}
          </h1>
          <p className="text-slate-300 mt-2 relative z-10">
            {translate("profile.description")}
          </p>
        </div>

        {/* Tabs Header */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${
              activeTab === "general" 
                ? "text-[--color-brand-primary] border-b-2 border-[--color-brand-primary]" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {translate("profile.tabGeneral")}
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${
              activeTab === "addresses" 
                ? "text-[--color-brand-primary] border-b-2 border-[--color-brand-primary]" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {translate("profile.tabAddresses")}
          </button>
        </div>

        <div className="p-8">
          {successMsg && (
            <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700 font-medium">
                {successMsg}
              </p>
            </div>
          )}

          {(error || localError) && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                {error || localError}
              </p>
            </div>
          )}

          {activeTab === "general" && (
            <form onSubmit={handleGeneralSubmit} className="space-y-8 animate-in fade-in">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewUrl("")}
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-slate-400" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-input"
                    className="absolute bottom-0 right-0 bg-[--color-brand-accent] text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-md flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      id="avatar-input"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-slate-900">
                    {translate("profile.avatarLabel")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {translate("profile.avatarSpecs")}
                  </p>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("profile.idLabel")} / DNI
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      disabled
                      className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 text-slate-500 bg-slate-100 rounded-lg sm:text-sm cursor-not-allowed"
                      value={taxId || user?.id || ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("profile.emailLabel")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      disabled
                      className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 text-slate-500 bg-slate-100 rounded-lg sm:text-sm cursor-not-allowed"
                      value={email}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("profile.nameLabel")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-brand-accent] focus:border-transparent sm:text-sm bg-slate-50/50"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("profile.phoneLabel")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-brand-accent] focus:border-transparent sm:text-sm bg-slate-50/50"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("profile.languageLabel")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-brand-accent] focus:border-transparent sm:text-sm bg-slate-50/50"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                    >
                      <option value="">{translate("profile.selectLanguage")}</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {translate("profile.passwordLabel")}
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        disabled
                        className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 text-slate-500 bg-slate-100 rounded-lg sm:text-sm cursor-not-allowed"
                        value={pendingPassword ? "pending-update" : "••••••••"}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {translate("profile.updatePasswordBtn")}
                    </button>
                  </div>
                  {pendingPassword && (
                    <p className="text-xs font-semibold text-[--color-brand-accent] mt-2">
                      {translate("profile.passwordPending")}
                    </p>
                  )}
                </div>
              </div>

              {/* Roles Info */}
              <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3 border border-slate-100">
                <Shield className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    {translate("profile.rolesLabel")}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2.5 py-1 bg-slate-200/70 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider"
                      >
                        {role}
                      </span>
                    )) || (
                      <span className="text-sm text-slate-500 italic">
                        {translate("profile.noRoles")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  {translate("profile.logoutButton")}
                </button>

                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-white bg-[--color-brand-primary] hover:bg-[--color-brand-primary-hover] disabled:opacity-75 disabled:cursor-not-allowed rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {translate("profile.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {translate("profile.saveButton")}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === "addresses" && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">{translate("profile.myAddresses")}</h3>
                <button 
                  onClick={openAddAddressModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[--color-brand-primary] text-white font-semibold text-sm rounded-lg hover:bg-[--color-brand-primary-hover] transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  {translate("profile.addAddressBtn")}
                </button>
              </div>

              {loadingAddresses ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-[--color-brand-primary] rounded-full animate-spin"></div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">{translate("profile.noAddressesFound")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-5 rounded-xl border relative ${addr.isDefault ? 'border-[--color-brand-primary] bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
                      {addr.isDefault && (
                        <div className="absolute top-4 right-4 text-[--color-brand-accent] flex items-center gap-1 text-xs font-bold uppercase">
                          <Star className="w-4 h-4 fill-current" />
                          {translate("profile.defaultAddress")}
                        </div>
                      )}
                      <h4 className="font-bold text-slate-800 mb-1">{addr.alias}</h4>
                      <p className="text-sm text-slate-600 font-semibold">{addr.firstName} {addr.lastName}</p>
                      {addr.company && <p className="text-sm text-slate-500">{addr.company}</p>}
                      <p className="text-sm text-slate-600 mt-2">{addr.street}</p>
                      <p className="text-sm text-slate-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-sm text-slate-600">{addr.country}</p>
                      {addr.phone && <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Phone className="w-3 h-3"/> {addr.phone}</p>}
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button 
                          onClick={() => openEditAddressModal(addr)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{translate("profile.modalTitle")}</h3>
              <button onClick={handlePasswordModalCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100">
                  {passwordError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translate("profile.oldPasswordLabel")}</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] focus:border-transparent outline-none"
                  value={oldPasswordInput}
                  onChange={(e) => setOldPasswordInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translate("profile.newPasswordLabel")}</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] focus:border-transparent outline-none"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translate("profile.repeatPasswordLabel")}</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] focus:border-transparent outline-none"
                  value={repeatPasswordInput}
                  onChange={(e) => setRepeatPasswordInput(e.target.value)}
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={handlePasswordModalCancel}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                {translate("profile.cancelBtn")}
              </button>
              <button
                onClick={handlePasswordModalOk}
                className="px-5 py-2 bg-[--color-brand-primary] text-white text-sm font-semibold rounded-lg hover:bg-[--color-brand-primary-hover] shadow-md transition-all"
              >
                {translate("profile.okBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAddress ? translate("profile.editAddressTitle") : translate("profile.addAddressTitle")}
              </h3>
              <button onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form id="address-form" onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrAlias")}</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrAlias} onChange={e => setAddrAlias(e.target.value)} placeholder="e.g. Casa, Trabajo" />
                </div>
                
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrFirstName")}</label>
                    <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                      value={addrFirstName} onChange={e => setAddrFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrLastName")}</label>
                    <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                      value={addrLastName} onChange={e => setAddrLastName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrCompany")}</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrCompany} onChange={e => setAddrCompany(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrPhone")}</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrPhone} onChange={e => setAddrPhone(e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrStreet")}</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrStreet} onChange={e => setAddrStreet(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrCity")}</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrCity} onChange={e => setAddrCity(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrZipCode")}</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrZipCode} onChange={e => setAddrZipCode(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrState")}</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrState} onChange={e => setAddrState(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrCountry")}</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrCountry} onChange={e => setAddrCountry(e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{translate("profile.addrNotes")}</label>
                  <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[--color-brand-accent] outline-none" 
                    value={addrNotes} onChange={e => setAddrNotes(e.target.value)} />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="isDefault" className="w-4 h-4 text-[--color-brand-primary] border-slate-300 rounded focus:ring-[--color-brand-primary]" 
                    checked={addrIsDefault} onChange={e => setAddrIsDefault(e.target.checked)} />
                  <label htmlFor="isDefault" className="text-sm font-medium text-slate-700">{translate("profile.addrIsDefault")}</label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                {translate("profile.cancelBtn")}
              </button>
              <button
                type="submit"
                form="address-form"
                className="px-5 py-2 bg-[--color-brand-primary] text-white text-sm font-semibold rounded-lg hover:bg-[--color-brand-primary-hover] shadow-md transition-all"
              >
                {translate("profile.saveBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
