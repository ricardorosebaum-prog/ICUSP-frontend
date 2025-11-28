import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // Allow Vite preview (used by `npm run preview`) to accept requests
  // coming from the Render-assigned hostname. This prevents the
  // "Blocked request. This host is not allowed" error when running
  // `vite preview` on Render.
  preview: {
    // add your render hostname(s) here
    allowedHosts: ["icusp-frontend.onrender.com"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
