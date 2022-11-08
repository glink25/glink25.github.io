import { PageType } from "@/utils";
import { PageData } from "vitepress";


export type CategoryType = {
  folder: string;
  title: string;
  name: string;
  describe?: string;
};

export type FriendLinkType = { title: string; href: string };

export type CustomThemeParam = {
  friendLinks?: FriendLinkType[];
  categories?: CategoryType[];
  apiOption?: {
    repo: string;
    path?: string
  }
};

export type CustomThemeConfig = {
  friendLinks?: FriendLinkType[];
  categories?: (CategoryType & {
    pages: PageType[];
  })[];
  apiOption?: {
    repo: string;
    path?: string
  },
};
