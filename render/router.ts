import { RouterOptions } from "vite-ssg";
import Homepage from "./Home.vue";
import Page from "./Page.vue";
import Edit from "./Edit.vue";

export const router: RouterOptions = {
  routes: [
    { name: "home", path: "/", component: Homepage },
    { name: "page", path: "/pages/:id", component: Page },
    { name: "edit", path: "/edit", component: Edit },
  ],
};
