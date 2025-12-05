import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), // Added react plugin
  ],
  server: {
    proxy: {
      // Proxying API requests from /api to http://localhost:8080/api
      // e.g. /api/auth/login -> http://localhost:8080/api/auth/login
      '/api': {
        target: 'http://localhost:8080', // Your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If you're using http
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
