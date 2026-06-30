/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useIdentityStore } from "../identity/identityStore";

export function AdminGuard() {
  const { isAuthenticated, user } = useIdentityStore();

  const isAdmin = user?.roles?.some(
    (role) => role.toUpperCase() === "ADMIN" || role.toUpperCase() === "ROLE_ADMIN"
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/catalog" replace />;
  }

  return <Outlet />;
}
