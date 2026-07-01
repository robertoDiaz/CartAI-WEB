/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { LandingPage } from "../features/landing/LandingPage";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { LoginPage } from "../features/identity/LoginPage";
import { RegisterPage } from "../features/identity/RegisterPage";
import { ProfilePage } from "../features/identity/ProfilePage";
import { AdminGuard } from "../features/admin/AdminGuard";
import { AdminLayout } from "../features/admin/AdminLayout";
import { UserManagement } from "../features/admin/UserManagement";
import { RoleManagement } from "../features/admin/RoleManagement";
import { ProductManagement } from "../features/admin/ProductManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "home",
        element: <LandingPage />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "admin",
        element: <AdminGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/users" replace />,
              },
              {
                path: "users",
                element: <UserManagement />,
              },
              {
                path: "roles",
                element: <RoleManagement />,
              },
              {
                path: "products",
                element: <ProductManagement />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
