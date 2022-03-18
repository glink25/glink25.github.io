import { onUpdated, onMounted } from "vue";
export const setThemeColor = (color: string) => {
  const metas = document.getElementsByTagName("meta");
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === "theme-color") {
      metas[i].content = color;
      break;
    }
  }
};
export default function useDynamicThemeColor() {
  const update = () => {
    // const isClient = typeof window === null;
    // if (!isClient) return;
    const darkEl = window.matchMedia("(prefers-color-scheme: dark)");
    const syncColor = () => {
      const rootEl = document.querySelector(":root");
      if (rootEl) {
        const bgColor = getComputedStyle(rootEl).getPropertyValue("--bg-color");
        setThemeColor(bgColor);
      }
    };
    darkEl.addEventListener("change", (e) => {
      syncColor();
    });
    syncColor();
  };
  onUpdated(update);
  onMounted(update);
}
