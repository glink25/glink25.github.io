import { RouterOptions } from "vite-ssg";
import Homepage from "./Home.vue";
import Page from "./Page.vue";
import Edit from "./Edit.vue";
import NotFound from "./NotFound.vue";
import Tags from "./Tags.vue";

export const router: RouterOptions = {
  routes: [
    { name: "home", path: "/:page?", component: Homepage },
    { name: "page", path: "/pages/:id", component: Page },
    { name: "edit", path: "/edit", component: Edit },
    { name: "tags", path: "/tags/:tag?", component: Tags },
    { name: "404", path: "/not-found", component: NotFound },
  ],
};
