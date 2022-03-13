import { CatagoryType, PageType } from "../utils/pages";

export type FriendLinkType = { title: string; href: string };

export type CustomThemeConfig = {
  friendLinks?: FriendLinkType[];
  catagories?: (CatagoryType & {
    pages: PageType[];
  })[];
};
