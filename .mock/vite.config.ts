import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname),
  server: { port: 5199, strictPort: true, host: "127.0.0.1" },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  plugins: [react(), tailwindcss()],
});
