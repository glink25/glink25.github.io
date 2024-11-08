import { defineConfig, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";
import UnoCSS from "unocss/vite";
import { FSAdapterPlugin } from "./adapter/fs/plugin";
import { SSRDataPlugin } from "./adapter/transformer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue() as any, UnoCSS(), FSAdapterPlugin(), SSRDataPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  server: {
    host: true,
  },
});
