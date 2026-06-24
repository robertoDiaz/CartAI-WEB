import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    svgr({
      svgrOptions: {
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeUnknownsAndDefaults: false,
                },
              },
            },
            {
              name: "removeElements",
              params: {
                elements: ["ContainsAiGeneratedContent"],
              },
            },
          ],
        },
      },
    }),
  ],
});
