import { readFile, readdir } from "fs/promises";
import { parseMeta, pathToId, parseIntro } from "../../../shared/transform";
import type { JSONContent } from "@tiptap/core";
import { getSSRHTML } from "../../../editor/extensions";

let stored: {
  id: string;
  path: string;
  intro: string;
  title: string;
  tags: string[];
  updateTime: number;
  createTime: number;
}[] | undefined
export const getPageList = async () => {
  if (stored) return stored
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
      return {
        // content: JSON.stringify(content),
        ...meta,
        id: pathToId(path),
        path,
        intro: parseIntro(content) ?? "",
        // html: getSSRHTML(content),
      };
    })
  );
  const pageData = rawPageData.sort((a, b) => b.createTime - a.createTime);
  if (import.meta.env.PROD) {
    stored = pageData
  }
  return pageData;
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
  const list = await getPageList();
  return new Response(JSON.stringify(list), { status: 200 });
}