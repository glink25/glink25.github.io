import defaultTheme from "vitepress/theme";
import NotFound from "./NotFound.vue";
import Layout from "./Layout.vue";
import { type EnhanceAppContext } from "vitepress";
import configRouter from "./route";
import "virtual:windi.css";

export default {
  ...defaultTheme,
  NotFound,
  Layout,
  enhanceApp(app: EnhanceAppContext) {
    configRouter(app);
  },
};
