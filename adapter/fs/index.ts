import { parseMeta, pathToId, toMeta } from "@/shared/transform";
import { ReadPageByPath, WritePage } from "../helper";

const PREFIX = "/fs-plugin-api";

export const readPageByPath: ReadPageByPath = async (path) => {
  // const path = `/pages/${_path}.json`;
  const content = await (await fetch(`${PREFIX}${path}`)).text();
  const json = JSON.parse(content);
  const meta = parseMeta(json);
  return {
    content: content,
    ...meta,
    id: pathToId(path),
    path,
  };
};

export const writePage: WritePage = async (path, data, assets) => {
  // const path = `/pages/${_path}.json`;
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
  await fetch(`${PREFIX}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: rawString,
  });
};
