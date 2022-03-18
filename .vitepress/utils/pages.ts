import fs from "mz/fs";
import globby from "globby";
import matter from "gray-matter";

type PagesReturnType = ReturnType<typeof getCatagoriesInfo>;

type PagesType = PagesReturnType extends Promise<infer R> ? R : any;

export type PageType = PagesType[number]["pages"][number];

export type CatagoryType = {
  folder: string;
  title: string;
  name: string;
  describe?: string;
};

const createCatagoryMD = (cat: CatagoryType) => {
  const filePath = `${cat.folder}.md`;
  const isMDExsits = fs.existsSync(filePath);
  if (!isMDExsits) {
    fs.writeFileSync(
      filePath,
      `---
title: ${cat.title}
describe: ${cat.describe}
home: true
---`
    );
  }
};

const getCatagoriesInfo = async (cats: CatagoryType[]) => {
  const info = await Promise.all(
    cats.map(async (cat) => {
      const paths = await globby([`${cat.folder}/**.md`]);
      createCatagoryMD(cat);
      const pages = await Promise.all(
        paths.map(async (item) => {
          const content = await fs.readFile(item, "utf-8");
          const { data } = matter(content);
          return {
            frontMatter: data,
            regularPath: `/${item.replace(".md", ".html")}`,
            relativePath: item,
          };
        })
      );
      pages.sort((a, b) => (a.frontMatter.data < b.frontMatter.data ? 1 : -1));
      return { ...cat, pages };
    })
  );
  return info;
};

export default getCatagoriesInfo;
