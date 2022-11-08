import { useData } from "vitepress";
import { computed } from "vue";
import { CustomThemeConfig } from "@/shared";

export const useCustomConfig = () => {
    const { site, page } = useData<CustomThemeConfig>();
    const isHomeLayout = computed(() => page.value.frontmatter.layout === 'home');
    const friendLinks = computed(() => site.value.themeConfig.friendLinks ?? []);
    const categories = computed(() => site.value.themeConfig.categories ?? []);
    const apiOption = computed(() => site.value.themeConfig.apiOption);

    return {
        isHomeLayout,
        friendLinks,
        categories,
        apiOption
    }
}