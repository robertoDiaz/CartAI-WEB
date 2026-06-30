/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { ArrowRight, Lock, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { useIdentityStore } from "./identityStore";

export function LoginPage() {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } =
    useIdentityStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/catalog");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/catalog");
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
        {/* Aesthetic background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br from-(--color-brand-accent) to-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-(--color-brand-primary) tracking-tight">
            {translate("auth.loginTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            {translate("auth.loginOr")}
            <Link
              to="/register"
              className="font-medium text-(--color-brand-accent) hover:underline transition-all"
            >
              {translate("auth.createAccountLink")}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
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
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-accent) focus:border-transparent sm:text-sm transition-all bg-slate-50/50"
                  placeholder={translate("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-brand-primary) disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <LogIn className="h-5 w-5 text-indigo-200 group-hover:text-white transition-colors" />
                )}
              </span>
              {isLoading
                ? translate("auth.loginLoading")
                : translate("auth.loginButton")}
              {!isLoading && (
                <ArrowRight className="ml-2 w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
