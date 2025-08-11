import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://backend:8000", // 👈 Use service name, not localhost
        changeOrigin: true,
      },
      "/healthz": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
});
