import { ViteSSG, ViteSSGContext } from "vite-ssg";
import App from "./App.vue";
import "uno.css";
import "@unocss/reset/tailwind.css";
import { router } from "./router";
import { register } from "@/adapter/ssr-client";

export const createApp = ViteSSG(
  App,
  router,
  async (ctx) => {
    const { app, router: globalRouter, isClient } = ctx
    const globalData = await register(ctx)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // const { default: data } = await import("v:ssr-inject:meta");
    // app.provide(SHORTED_PAGE_DATA_INJECT_KEY, data);
    globalRouter.beforeEach(async (to, from,) => {
      const match = router.routes.find((r) => r.name === to.name);
      if (!match) return true;
      return match.guard?.(to, globalData) ?? true;
    });
  }
);
