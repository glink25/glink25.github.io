import { PageData } from "./type";

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

export const pathToId = (path: string) => encodeURIComponent(path.replace(/\.json$/, ""));

export const idToPath = (id: string) => `${decodeURIComponent(id)}.json`;
