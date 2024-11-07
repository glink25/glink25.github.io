// src/main.ts
import { RouterOptions, ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "uno.css";
import "@unocss/reset/tailwind.css";
import { PAGE_INJECT_KEY } from "./hooks/page";
import { router } from "./router";
import { getPageData } from "./reader";
import { chunkArray } from "@/shared/utils";

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
  const pageSize = 10;
  const pageCount = Math.ceil(pageData.length / pageSize);
  return [
    // homepage
    "/",
    // pagination
    ...Array.from({ length: pageCount }, (_, i) => `/${i}`),
    // post page
    ...pageData.map((v) => `/pages/${v.id}`),
    // editor
    "/editor",
  ];
};
