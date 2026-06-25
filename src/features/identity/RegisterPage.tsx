/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useIdentityStore } from "./identityStore";

export function RegisterPage() {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearError } = useIdentityStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/catalog");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when unmounting or when inputs change
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate("/catalog");
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
        
        {/* Aesthetic background element */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-linear-to-tr from-(--color-brand-primary) to-blue-300 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-(--color-brand-primary) tracking-tight">
            {translate("auth.registerTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            {translate("auth.registerAlready")}
            <Link to="/login" className="font-medium text-(--color-brand-accent) hover:underline transition-all">
              {translate("auth.loginLink")}
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                {translate("auth.nameLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent sm:text-sm transition-all bg-slate-50/50"
                  placeholder={translate("auth.namePlaceholder")}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) clearError();
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
                {translate("auth.emailLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent sm:text-sm transition-all bg-slate-50/50"
                  placeholder={translate("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                {translate("auth.passwordLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent sm:text-sm transition-all bg-slate-50/50"
                  placeholder={translate("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-(--color-brand-accent) hover:bg-(--color-brand-accent-hover) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-brand-accent) disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <UserPlus className="h-5 w-5 text-orange-200 group-hover:text-white transition-colors" />
                )}
              </span>
              {isLoading ? translate("auth.registerLoading") : translate("auth.registerButton")}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
