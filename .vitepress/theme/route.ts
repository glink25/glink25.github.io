import { EnhanceAppContext, SiteData } from "vitepress";
import { watch, computed } from "vue";
import { CustomThemeConfig } from "./type";

export default function configRouter({ router, siteData }: EnhanceAppContext) {
  const catagories = computed(
    () => (siteData.value as SiteData<CustomThemeConfig>).themeConfig.catagories
  );
  watch(router.route, (route) => {
    if (!catagories.value?.length) return;
    // redirect
    if (route.path === "/") {
      router.go(catagories.value[0].folder);
    }
  });
}
