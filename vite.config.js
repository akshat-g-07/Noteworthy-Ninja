import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/service-worker.js"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "background"
            ? "[name].js"
            : "[name]-[hash].js";
        },
      },
    },
  },
});
