import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as dotenv from 'dotenv'

dotenv.config()
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/featuredcategories": {
        target: "https://store.steampowered.com",
        changeOrigin: true,
      },
      "/api/product": {
        target: `${process.env["BACKEND_URL"]}`,
        changeOrigin: true,
      },
      "/ISteamApps": {
        target: "https://api.steampowered.com",
        changeOrigin: true,
      },
    },
  },
  plugins: [vue()],
});
