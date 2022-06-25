import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/featuredcategories": {
        target: "https://store.steampowered.com",
        changeOrigin: true,
      },
      "/api/product": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
    
  },
  plugins: [vue()],
});
