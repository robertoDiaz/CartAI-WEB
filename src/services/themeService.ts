/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import themeFallback from "../config/theme-fallback.json";

export const themeService = {
  initializeTheme: async (): Promise<void> => {
    let customTheme: Record<string, string> = {};
    
    if (typeof window !== "undefined" && window.location) {
      const protocol = window.location.protocol;
      if (protocol === "http:" || protocol === "https:") {
        try {
          const url = `${window.location.origin}/theme-custom.json`;
          const response = await fetch(url);
          if (response.ok) {
            customTheme = await response.json();
            console.log("Custom theme overrides successfully loaded from theme-custom.json");
          } else {
            console.info("No custom theme overrides found (theme-custom.json not present or failed to load). Using fallback theme.");
          }
        } catch (error) {
          console.info("Could not load dynamic theme overrides, using default theme:", error);
        }
      } else {
        console.info(`Skipping dynamic theme load: unsupported protocol '${protocol}'`);
      }
    }

    const mergedTheme = { ...themeFallback, ...customTheme };
    const root = document.documentElement;

    Object.entries(mergedTheme).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });

    console.log("Theme successfully initialized");
  },
};
