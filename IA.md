# Cart•AI - Diseño Final y Arquitectura de la Landing Page

Este documento recopila la estrategia de diseño estético, decisiones de interfaz y la estructura técnica modular acordada para el frontend de **Cart•AI**.

---

## 1. Identidad Visual y Sistema de Diseño

### Paleta Cromática Estricta

Para evitar inconsistencias visuales y garantizar una integración limpia con los assets de marca, se define el siguiente esquema de color:

- **Fondo Principal (`#f8f9fa`):** Tono crema-hueso exacto extraído del logo original. Se utiliza en toda la landing page para fundir de manera nativa los bordes del logo sin recurrir a parches de opacidad o mezclas de color complejas.
- **Color Primario (`#0a192f`):** Azul marino profundo (extraído del texto "Cart"). Garantiza la máxima legibilidad en textos largos, títulos principales y componentes estructurales.
- **Color de Acento (`#e85d04`):** Naranja vibrante (extraído de las ruedas y el punto del logo). Su uso queda restringido exclusivamente a elementos de interacción crítica y llamadas a la acción (_Call to Action_ o CTA), asegurando que resalten inmediatamente sobre el fondo suave.

### Tipografía

- **Títulos principales y encabezados:** `Urbanist` (fuente sans-serif geométrica que aporta limpieza y modernidad).
- **Cuerpo de texto y descripciones:** `Lato` (fuente humanista optimizada para legibilidad en entornos web).

---

## 2. Integración de Assets Gráficos

### Gestión del Logo (Estrategia SVG)

- **Formato:** Uso obligatorio de la versión vectorial con fondo transparente para evitar problemas de escalado y pixelado en pantallas de alta densidad (Retina/4K).
- **Pipeline de Carga (Vite + TS):** Integración mediante el plugin `vite-plugin-svgr`. Permite importar y manipular el SVG directamente como si fuera un componente React.
- **Automatización contra Contenido Basura:** Se configura el optimizador **SVGO** en el archivo `vite.config.ts` mediante la regla `removeElements` para interceptar y destruir de manera automática la etiqueta `<ContainsAiGeneratedContent>` inyectada por herramientas de IA. Esto previene errores de referencia (`ReferenceError`) en tiempo de compilación sin requerir edición manual archivo por archivo.

---

## 3. Arquitectura de Componentes (Feature-Driven)

Para evitar la creación de un monolito visual inmanejable, la landing page se fragmenta siguiendo el patrón de desarrollo orientado a características (**FDD**):

```text
src/
├── components/             # UI Global y reutilizable (sin estado de negocio)
│   ├── ui/                 # Componentes atómicos (Button, Input, Badge)
│   └── layout/             # Estructuras de contenedor de página
├── features/               # Dominios aislados por lógica de negocio
│   └── landing/            # Módulo exclusivo de la página de bienvenida
│       ├── components/     # Navbar.tsx, HeroSection.tsx, FeatureCard.tsx
│       └── LandingPage.tsx # Componente orquestador
├── routes/                 # Centralización del enrutamiento
│   └── index.tsx
├── App.tsx                 # Inicializador de proveedores globales (Router)
└── main.tsx                # Punto de entrada al DOM
```
