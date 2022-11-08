import { defineConfig } from "windicss/helpers";
import WindiIcon from "@windicss/plugin-icons";

export default defineConfig({
  plugins: [WindiIcon],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand-color)',
        background: "var(--bg-color)"
      }
    }
  }
});
