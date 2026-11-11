// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendPort =
  process.env.VITE_BACKEND_PORT || process.env.BACKEND_PORT || "5000";
const backendUrl = `http://127.0.0.1:${backendPort}`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": backendUrl,
      "/uploads": backendUrl,
    },
  },
});
