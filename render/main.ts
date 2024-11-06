// src/main.ts
import { RouterOptions, ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "uno.css";
import "@unocss/reset/tailwind.css";
import { PAGE_INJECT_KEY } from "./hooks/page";
import { router } from "./router";
import { PageData } from "@/shared/type";
import { parseMeta, pathToId } from "@/shared/transform";

let _pageData: PageData[] | undefined = undefined;
const getPageData = async () => {
  if (_pageData !== undefined) return _pageData;
  const pageFiles = import.meta.glob("@/pages/*.json");
  const pageData = await Promise.all(
    Object.entries(pageFiles).map(async ([path, file]) => {
      const { default: content } = (await file()) as any;
      return { content: JSON.stringify(content), ...parseMeta(content), id: pathToId(path), path };
    })
  );
  _pageData = pageData;
  return pageData;
};

// `export const createApp` is required instead of the original `createApp(App).mount('#app')`
export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  router,
  // function to have custom setups
  async ({ app }) => {
    // install plugins etc.
    const pageData = await getPageData();
    app.provide(PAGE_INJECT_KEY, pageData);
  }
);

export const includedRoutes = async (_paths: string[], _routes: RouterOptions) => {
  const pageData = await getPageData();
  return ["/", ...pageData.map((v) => `/pages/${v.id}`), "/editor"];
};
