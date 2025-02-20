import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "index.html",
        landing: "src/html/landing.html",
        content: "src/scripts/content.ts",
        background: "src/scripts/background.ts",
        script: "src/scripts/script.ts",
      },
      output: {
        // Customize output file names if needed
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
