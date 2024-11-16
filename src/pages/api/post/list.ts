import { readFile, readdir } from "fs/promises";
import { parseMeta, pathToId, parseIntro } from "@/shared/transform";
import type { JSONContent } from "@tiptap/core";
import { getSSRHTML } from "@/editor/extensions";
import type { ShortPageData } from "@/shared/type";

const cache = new Map<boolean, ShortPageData[]>();
export const getPageList = async (filterDraft = true) => {
  if (cache.has(filterDraft)) return cache.get(filterDraft)!
  const dir = await readdir("./posts", { withFileTypes: true });
  const pageFiles = await Promise.all(
    dir
      .filter((v) => v.isFile() && v.name.endsWith(".json"))
      .map(async (v) => {
        const file = await readFile(`./posts/${v.name}`, { encoding: "utf-8" });
        return [v.name, JSON.parse(file)] as [string, JSONContent];
      })
  );
  const tags = new Set<string>();

  const rawPageData = await Promise.all(
    pageFiles.map(async ([path, content]) => {
      const meta = parseMeta(content);
      meta.tags.forEach((t) => tags.add(t));
      const cover = content.content?.find(v => v.type === 'image')?.attrs as any
      return {
        // content: JSON.stringify(content),
        ...meta,
        id: pathToId(path),
        path,
        intro: parseIntro(content) ?? "",
        cover
        // html: getSSRHTML(content),
      };
    })
  );
  const pageData = rawPageData.sort((a, b) => b.createTime - a.createTime);

  if (filterDraft) {
    if (import.meta.env.PROD) {
      const filtered = pageData.filter(p => !p.draft);
      cache.set(filterDraft, filtered)
    }
    return pageData.filter(p => !p.draft);
  }
  if (import.meta.env.PROD) {
    cache.set(filterDraft, pageData)
  }
  return pageData
};

export const getSinglePageData = async (id: string) => {
  const text = await readFile(`./posts/${decodeURIComponent(id)}.json`, { encoding: "utf-8" });
  const content = JSON.parse(text);
  const meta = parseMeta(content);
  return {
    content: text,
    ...meta,
    id,
    path: `/posts/${id}.json`,
    intro: parseIntro(content) ?? "",
    html: getSSRHTML(content),
  };
};

export async function GET() {
  const list = await getPageList(false);
  return new Response(JSON.stringify(list), { status: 200 });
}