import { defineConfigWithTheme, type UserConfig } from "vitepress";
import { CustomThemeParam } from "@/shared";
import getCategoriesInfo from "./pages";

export const defineCustomConfig = async (
    params: CustomThemeParam & UserConfig
) => {
    return defineConfigWithTheme<CustomThemeParam>({
        ...params,
        themeConfig: {
            ...params.themeConfig,
            categories: await getCategoriesInfo(params.categories ?? []),
            friendLinks: params.friendLinks,
            apiOption: params.apiOption
        },
    });
}
