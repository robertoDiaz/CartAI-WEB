/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../../../features/cart/cartStore";
import { useIdentityStore } from "../../../features/identity/identityStore";

export function useNavbar() {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const { isAuthenticated, user, logout } = useIdentityStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.roles?.some(
    (role) => role.toUpperCase() === "ADMIN" || role.toUpperCase() === "ROLE_ADMIN"
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/");
  };

  return {
    translate,
    totalItems,
    isAuthenticated,
    user,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    handleLogout,
    dropdownRef,
    isAdmin,
  };
}
