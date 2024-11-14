// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  output: import.meta.env.DEV?'server':'static',
  integrations: [UnoCSS({ injectReset: true })],
  server:{
    port: 4321
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./", import.meta.url)),
      },
    },
  },
});
