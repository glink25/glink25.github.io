import { parseMeta, pathToId, parseIntro } from "@/shared/transform";
import { PageData } from "@/shared/type";

export type EnPageData = PageData & { intro: string };

let _pageData: EnPageData[] | undefined = undefined;

export const getPageData = async () => {
  if (_pageData !== undefined) return _pageData;
  const pageFiles = import.meta.glob("@/pages/*.json");
  const rawPageData = await Promise.all(
    Object.entries(pageFiles).map(async ([path, file]) => {
      const { default: content } = (await file()) as any;
      return {
        content: JSON.stringify(content),
        ...parseMeta(content),
        id: pathToId(path),
        path,
        intro: parseIntro(content) ?? "",
      };
    })
  );
  const pageData = rawPageData.sort((a, b) => b.createTime - a.createTime);
  _pageData = pageData;
  return pageData;
};
