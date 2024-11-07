import { defineConfig, transformerDirectives, presetUno, presetIcons } from "unocss";
import fs from "fs";
const loadJSON = (path: string) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), { encoding: "utf-8" }));

const themes = {
  dark: {
    colors: {
      primary: "rgba(217, 173, 0, 1)",
      text: "#fff",
      icon: "#fff",
      bg: "#333",
    },
  } as any,
  light: {
    colors: {
      primary: "#facc15",
      text: "#000",
      icon: "rgba(116,115,115,1)",
      bg: "#fff",
    },
  },
};

export default defineConfig({
  transformers: [transformerDirectives({ enforce: "pre" })],
  presets: [
    presetUno({
      dark: "media",
    }),
    presetIcons({
      autoInstall: true,
    }),
    // ...other presets
  ],
  theme: themes.light,
});
