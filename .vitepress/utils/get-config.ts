import { defineConfigWithTheme, UserConfig } from "vitepress";
import { CustomThemeConfig } from "../theme/type";
import getCatagoriesInfo, { CatagoryType } from "./pages";

type CustomConfigParam = {
  catagories: CatagoryType[];
  friendLinks?: { title: string; href: string }[];
};

export default async function getCustomConfig(
  params: CustomConfigParam & UserConfig
) {
  return defineConfigWithTheme<CustomThemeConfig>({
    ...params,
    themeConfig: {
      ...params.themeConfig,
      catagories: await getCatagoriesInfo(params.catagories),
      friendLinks: params.friendLinks,
    },
  });
}
