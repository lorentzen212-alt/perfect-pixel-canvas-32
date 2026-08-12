import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";
export default defineConfig({
  root: path.resolve(import.meta.dirname, "."),
  plugins: [react(), tailwind()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: { port: 5199 },
});
