# Cart•AI - Final Design and Landing Page Architecture

This document collects the aesthetic design strategy, interface decisions, and technical modular structure agreed upon for the **Cart•AI** frontend.

---

## 1. Visual Identity and Design System

### Strict Color Palette

To avoid visual inconsistencies and ensure a clean integration with the brand assets, the following color scheme is defined:

- **Main Background (`#f8f9fa`):** The exact cream-bone tone extracted from the original logo. It is used throughout the landing page to merge the edges of the logo natively without resorting to opacity patches or complex color mixing.
- **Primary Color (`#0a192f`):** Deep navy blue (extracted from the "Cart" text). Guarantees maximum legibility in long texts, main headings, and structural components.
- **Accent Color (`#e85d04`):** Vibrant orange (extracted from the wheels and the dot of the logo). Its use is strictly restricted to critical interaction elements and Call to Action (CTA) buttons, ensuring they stand out immediately against the soft background.

### Typography

- **Headings and Titles:** `Urbanist` (a clean, modern, geometric sans-serif font).
- **Body and Descriptions:** `Lato` (a humanist font optimized for web legibility).

---

## 2. Graphic Asset Integration

### Logo Management (SVG Strategy)

- **Format:** Mandatory use of the vector version with transparent background to prevent scaling issues on high-density displays (Retina/4K).
- **Build Pipeline (Vite + TS):** Integration via `vite-plugin-svgr`. It imports and manipulates the SVG directly as a React component.
- **Automatic Cleanup:** Configured **SVGO** in `vite.config.ts` using the `removeElements` rule to automatically intercept and remove the `<ContainsAiGeneratedContent>` tag injected by AI generation tools. This prevents compilation reference errors (`ReferenceError`) without requiring manual file-by-file cleaning.

---

## 3. Modular Architecture (Feature-Driven)

To avoid an unmaintainable code monolith, the app layout is split using the Feature-Driven Development (**FDD**) pattern:

```text
src/
├── components/             # Global, reusable UI (no business state)
│   ├── ui/                 # Atomic components (Button, Input, Badge)
│   └── layout/             # Layout structural wrappers (Navbar, Footer, MainLayout)
├── features/               # Domains isolated by business logic
│   ├── landing/            # Landing page module (HeroSection, FeatureCard)
│   └── catalog/            # Catalog and shopping cart module
├── routes/                 # Navigation routing centralizer
│   └── index.tsx
├── App.tsx                 # Global providers initialization
└── main.tsx                # DOM entry point
```

---

# Frontend Development Status Summary: Cart•AI

This section details the current progress, architectural decisions, and the development roadmap to provide context for subsequent AI agent iterations.

## 1. Completed Milestones (Steps 1 to 13)

* **State & Logic Persistence**: Implemented cart persistence with Zustand and `localStorage` in `cartStore.ts`. Business logic (stock limits, total price calculations) is fully centralized in the store and decoupled from React components.
* **Layouts and Routing**: Created `MainLayout.tsx` as a persistent layout wrapper. Configured dynamic routing using `react-router-dom` to switch between the Landing Page (`/`) and Catalog Page (`/catalog`).
* **Service Abstraction (Async Mocks)**: Created `productService.ts` and `analyticsService.ts` simulating network latency with Promises to enable seamless backend integration.
* **Dynamic Styling (White-labeling)**:
  - Cleaned up static variables in `index.css` by removing the `:root` block.
  - Implemented an internal default theme in [theme-fallback.json](file:///Users/rober/work/CartAI-WEB/src/config/theme-fallback.json).
  - Provided support for user-defined overrides in [theme-custom.json](file:///Users/rober/work/CartAI-WEB/public/theme-custom.json).
  - Programmed `themeService.ts` to check runtime protocol safety (preventing CORS failures on `file://` or serverless SSR environments), fetch overrides asynchronously relative to `window.location.origin`, merge both themes, and inject them before React mounts in `main.tsx`.
* **Semantic Refactoring**: Refactored translation structures to rename the default i18next `t` alias to `translate` for semantic clarity across all components.
* **Unit Testing (Vitest)**: Configured Vitest, jsdom, and `@testing-library/jest-dom`. Written comprehensive unit test suites for `cartStore.ts` (cart operations, totals, limits) and `themeService.ts` (theme configuration fallbacks and overriding resolution).
* **Gestión de Perfil y Subida de Avatar**:
  - Implementado el flujo completo de subida y gestión de foto de perfil (avatar) en total sincronía con el backend mediante `PUT /api/users/avatar/{id}`.
  - La arquitectura del store global en `identityStore.ts` se ha optimizado para que, al subir un archivo, se almacene de inmediato el objeto `User` actualizado, eliminando estados locales redundantes y actualizando la interfaz de previsualización al vuelo.
  - Adaptados los endpoints y maquetación para leer la ruta oficial de recursos multimedia `/api/storage/files/`.
* **Testing E2E (Playwright)**:
  - Se ha integrado Playwright para pruebas funcionales completas (E2E) contra el servidor backend real.
  - Se ha creado el test de subida de avatar simulando un flujo completo de autenticación y carga multipart/form-data.
* **Seguridad de Perfil (Email y Password)**:
  - Se ha implementado un popup de cambio de contraseña (`oldPassword`, `newPassword`) directamente desde la página de Perfil.
  - El campo `email` se ha bloqueado como elemento de solo lectura para alinearse con la inmutabilidad de la API backend. Se ha limpiado el `email` de todas las peticiones `PUT` y test funcionales.
* **Limpieza y Corrección de Tipos en Perfil**:
  - Resueltos avisos de variables no utilizadas (como `onClosePasswordModal`) y errores de referencias indefinidas en los modales de dirección y contraseña.
  - Corregido el tipado en el hook `useProfileAddresses` para interactuar de forma segura con los tipos de eventos en los checkboxes (`checked`).
  - Corregida la estructura de acceso a los formularios (`generalForm` y `addressForm`), eliminando anidamientos de propiedad `.form` obsoletos.
  - Eliminados errores sintácticos residuales (como etiquetas duplicadas y caracteres erróneos en JSX) y limpios los imports innecesarios (`React` e `useEffect`), logrando una compilación exitosa y sin warnings.
* **Dropdown de Perfil y Panel de Administración (Usuarios y Roles)**:
  - Diseñado e implementado el menú interactivo (Dropdown) de perfil en la barra de navegación, aislando su estado y el listener de click fuera de la caja en el custom hook [useNavbar.ts](file:///Users/rober/work/CartAI-WEB/src/components/layout/hooks/useNavbar.ts).
  - Desarrollada la protección de rutas mediante [AdminGuard.tsx](file:///Users/rober/work/CartAI-WEB/src/features/admin/AdminGuard.tsx) y la distribución del panel lateral en [AdminLayout.tsx](file:///Users/rober/work/CartAI-WEB/src/features/admin/AdminLayout.tsx).
  - Creado el panel de control de gestión de usuarios (CRUD) mediante [UserManagement.tsx](file:///Users/rober/work/CartAI-WEB/src/features/admin/UserManagement.tsx) y el hook de lógica [useUserManagement.ts](file:///Users/rober/work/CartAI-WEB/src/features/admin/hooks/useUserManagement.ts).
  - Creada la gestión de roles y permisos mediante [RoleManagement.tsx](file:///Users/rober/work/CartAI-WEB/src/features/admin/RoleManagement.tsx) y su respectivo hook [useRoleManagement.ts](file:///Users/rober/work/CartAI-WEB/src/features/admin/hooks/useRoleManagement.ts).
  - Todos los endpoints se comunican en tiempo real con la API local en Spring Boot y persisten los datos en MongoDB.
  - Las claves de localización en [es_ES.json](file:///Users/rober/work/CartAI-WEB/src/i18n/locales/es_ES.json) y [en_US.json](file:///Users/rober/work/CartAI-WEB/src/i18n/locales/en_US.json) han sido ordenadas alfabéticamente de forma estricta.

---

## 2. Immediate Roadmap (Next Step)

### Backend Integration
The next immediate phase is connecting the client app to the live backend services:
1. **Verificación de Almacenamiento y Avatar**: Validar en un entorno real la persistencia tras el guardado de avatares vía `/api/storage/files/`.
2. **Catalog Retrieval**: Replace static mock data inside `productService.ts` with real REST or GraphQL API fetch queries.
3. **Real-time Analytics**: Wire up dashboard widgets and charts inside `HeroSection.tsx` to read from live backend event streams/data feeds.
