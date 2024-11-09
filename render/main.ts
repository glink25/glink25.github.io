import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "uno.css";
import "@unocss/reset/tailwind.css";
import { SHORTED_PAGE_DATA_INJECT_KEY } from "./hooks/page";
import { router } from "./router";

export const createApp = ViteSSG(
  App,
  router,
  async ({ app, router: globalRouter }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { default: data } = await import("v:ssr-inject:meta");
    console.log(data, 'data')
    app.provide(SHORTED_PAGE_DATA_INJECT_KEY, data);
    globalRouter.beforeEach((to) => {
      const match = router.routes.find((r) => r.name === to.name);
      if (!match) return true;
      return match.guard?.(to, data) ?? true;
    });
  }
);
