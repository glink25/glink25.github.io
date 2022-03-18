import defaultTheme from "vitepress/theme";
import NotFound from "./NotFound.vue";
import Layout from "./Layout.vue";
import { EnhanceAppContext } from "vitepress";
import configRouter from "./route";
export default {
  ...defaultTheme,
  NotFound,
  Layout,
  enhanceApp(app: EnhanceAppContext) {
    configRouter(app);
  },
};
