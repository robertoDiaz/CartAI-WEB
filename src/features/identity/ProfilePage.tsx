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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { identityService } from "./identityService";
import { useIdentityStore } from "./identityStore";

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
  } = useIdentityStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFileId, setAvatarFileId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [localError, setLocalError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else {
      setName(user.name);
      setEmail(user.email);
      setAvatarFileId(user.avatarFileId || "");
      if (user.avatarFileId) {
        setPreviewUrl(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/files/${user.avatarFileId}`,
        );
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary preview locally
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);
    setLocalError("");
    setSuccessMsg("");

    try {
      const response = await identityService.uploadAvatar(file);
      // Store the returned URL in avatarFileId state so it can be passed to the PUT request.
      setAvatarFileId(response.avatarFileURL);
      // Use the URL directly for the preview image
      setPreviewUrl(response.avatarFileURL);
      setSuccessMsg(translate("profile.uploadSuccess"));
    } catch (err: any) {
      setLocalError(translate("profile.uploadError"));
      // Rollback preview
      if (user?.avatarFileId) {
        setPreviewUrl(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/files/${user.avatarFileId}`,
        );
      } else {
        setPreviewUrl("");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLocalError("");
    setSuccessMsg("");
    clearError();

    try {
      await updateProfile({
        id: user.id,
        name,
        email,
        roles: user.roles,
        avatarFileId: avatarFileId || undefined,
      });
      setSuccessMsg(translate("profile.success"));
    } catch (err: any) {
      // Error will be shown via store error
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-linear-to-r from-(--color-brand-primary) to-slate-800 px-8 py-10 text-white relative">
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

          <form onSubmit={handleSubmit} className="space-y-8">
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
                  className="absolute bottom-0 right-0 bg-(--color-brand-accent) text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-md flex items-center justify-center"
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
                  {translate("profile.nameLabel")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent sm:text-sm bg-slate-50/50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    required
                    className="appearance-none block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent sm:text-sm bg-slate-50/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) disabled:opacity-75 disabled:cursor-not-allowed rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
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
        </div>
      </div>
    </div>
  );
}
