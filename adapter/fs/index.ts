import { idToPath, parseMeta, toMeta } from "@/shared/transform";
import { PageData } from "@/shared/type";

const PREFIX = "/fs-plugin-api";

export const readPageById = async (id: string): Promise<PageData> => {
  const path = idToPath(id);
  console.log(path, "path");
  const content = await (await fetch(`${PREFIX}${path}`)).text();
  const json = JSON.parse(content);
  const meta = parseMeta(json);
  return {
    content: content,
    ...meta,
    id,
    path,
  };
};

export const writePage = async (
  id: string,
  data: Pick<PageData, "content" | "title" | "tags">,
  assets: { name: string; url: string; file: Blob }[]
) => {
  const meta = toMeta({ ...data, updateTime: Date.now() });
  const rawString = JSON.stringify({ ...meta, ...JSON.parse(data.content) });
  await Promise.all(
    assets.map(({ file }) => {
      const body = new FormData();
      body.append("file", file);
      return fetch(`${PREFIX}/upload`, {
        method: "PATCH",
        headers: {
          // "Content-Type": "multipart/form-data",
        },
        body,
      });
    })
  );
  await fetch(`${PREFIX}${idToPath(id)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: rawString,
  });
};
