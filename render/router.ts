import Home from "./Home.vue";
import Page from "./Page.vue";
import NotFound from "./NotFound.vue";
import Tags from "./Tags.vue";
import type { RouteLocationNormalizedGeneric } from "vue-router";
import { EnPageData } from "./reader";

export const router = {
  routes: [
    {
      name: "home", path: "/:page?", component: Home, guard: (to: RouteLocationNormalizedGeneric, { pageData }: EnPageData) => {
        if (to.params.page === "") {
          return true;
        }
        const toPage = Number(to.params.page);
        if (Number.isNaN(toPage)) {
          return '/not-found';
        }
        const pageCount = pageData.length
        const canEnter = toPage < pageCount && toPage > pageCount;
        if (!canEnter) {
          return '/not-found';
        }
      }
    },
    {
      name: "page", path: "/pages/:id", component: Page, guard: (to: RouteLocationNormalizedGeneric, { pageData }: EnPageData) => {
        if (to.params.id === "") {
          return '/';
        }
        // vue router 会自动把地址栏中的id参数decode
        if (pageData.some(p => decodeURIComponent(p.id) === to.params.id)) {
          return true
        }
        return '/not-found'
      }
    },
    { name: "edit", path: "/edit", component: () => import("./Edit.vue") },
    {
      name: "tags", path: "/tags/:tag?", component: Tags, guard: (to: RouteLocationNormalizedGeneric, { tags }: EnPageData) => {
        if (to.params.tag === "") {
          return true;
        }
        if (tags.some(t => t === to.params.tag)) {
          return true
        }
        return '/not-found'
      }
    },
    { name: "404", path: "/not-found", component: NotFound },
  ],
};
