import type { JSONContent } from "@tiptap/core";
import { PageData } from "./type";
import slugify from "slugify";

const TITLE_KEY = "__ud_title";
const TAGS_KEY = "__ud_tags";
const CREATE_TIME_KEY = "__ud_create_time";
const UPDATE_TIME_KEY = "__ud_update_time";

export const parseMeta = (json: any) => {
  return {
    title: json[TITLE_KEY] as string,
    tags: json[TAGS_KEY] as string[],
    updateTime: json[UPDATE_TIME_KEY] as number,
    createTime: json[CREATE_TIME_KEY] as number,
  };
};

export const toMeta = (params: Partial<Pick<PageData, "createTime" | "updateTime" | "title" | "tags">>) => {
  return {
    [TITLE_KEY]: params.title,
    [TAGS_KEY]: params.tags,
    [UPDATE_TIME_KEY]: params.updateTime,
    [CREATE_TIME_KEY]: params.createTime,
  };
};

export const pathToId = (path: string) => slugify(path.replace(/\.json$/, ""));

export const parseTitle = (json: JSONContent) =>
  json.content
    ?.find((v) => v.type === "heading")
    ?.content?.map((v) => v.text)
    .join("");

export const parseIntro = (json: JSONContent) => {
  return json.content
    ?.find((v) => v.type === "paragraph")
    ?.content?.map((v) => v.text)
    .join("");
};

export const toUniqueFilename = (str: string) => slugify(`${Date.now().toString(36)}-${str}`).replace(/%/g, "-");

export const toFilename = (str: string) => slugify(`${str}`).replace(/%/g, "-");

