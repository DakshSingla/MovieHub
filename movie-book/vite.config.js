import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000", // for local development only
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      __API_URL__: JSON.stringify(
        mode === "production"
          ? "https://moviehub-server-seven.vercel.app/api"
          : "/api"
      ),
    },
  };
});
