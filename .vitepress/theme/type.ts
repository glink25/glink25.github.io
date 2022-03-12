import { PageType } from "../utils/pages";

export type CustomThemeConfig = {
  friendLinks?: { title: string; href: string }[];
  catagories?: {
    folder: string;
    title: string;
    name: string;
    pages: PageType[];
  }[];
};
