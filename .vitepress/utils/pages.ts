import { readdirSync, existsSync, writeFileSync } from "fs";
import { CategoryType } from "@/shared";
import { markdownInfo } from "./markdown";

type PagesReturnType = ReturnType<typeof getCategoriesInfo>;

type PagesType = PagesReturnType extends Promise<infer R> ? R : any;

export type PageType = PagesType[number]["pages"][number];


const DOC_PATH = ''

const createCategoryMD = (cat: CategoryType) => {
  const filePath = `${DOC_PATH}${cat.folder}.md`;
  const isMDExists = existsSync(filePath);
  if (!isMDExists) {
    writeFileSync(
      filePath,
      `---
title: ${cat.title}
describe: ${cat.describe}
layout: home
---`,
    );
  }
};

const getCategoriesInfo = async (cats: CategoryType[]) => {
  const info =
    cats.map((cat) => {
      createCategoryMD(cat);
      const paths = readdirSync(cat.folder, { withFileTypes: true })
      const pages =
        paths.filter(item => !item.isDirectory()).map((item) => {
          return markdownInfo(cat.folder, item.name)
        })

      pages.sort((a, b) => (a.frontMatter.data < b.frontMatter.data ? 1 : -1));
      return { ...cat, pages };
    })

  return info;
};

export default getCategoriesInfo;
