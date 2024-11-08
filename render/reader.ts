import { parseMeta, pathToId, parseIntro } from "@/shared/transform";
import { PageData } from "@/shared/type";

export type EnPageData = { pageData: (PageData & { intro: string; html: string })[]; tags: string[] };

let _pageData: EnPageData | undefined = undefined;
export const getPageData = async () => {
  if (_pageData !== undefined) return _pageData;
  const pageFiles = import.meta.glob("@/pages/*.json");
  const tags = new Set<string>();

  const { getSSRHTML } = await import("@/editor/extensions");
  const rawPageData = await Promise.all(
    Object.entries(pageFiles).map(async ([path, file]) => {
      const { default: content } = (await file()) as any;
      const meta = parseMeta(content);
      meta.tags.forEach((t) => tags.add(t));
      return {
        content: JSON.stringify(content),
        ...meta,
        id: pathToId(path),
        path,
        intro: parseIntro(content) ?? "",
        html: getSSRHTML(content),
      };
    })
  );
  const pageData = rawPageData.sort((a, b) => b.createTime - a.createTime);
  _pageData = { pageData, tags: [...tags] };
  return _pageData;
};
