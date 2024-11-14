import type { PageData } from "../shared/type";

let globalData: PageData[] | undefined;
export const getGlobalData = async () => {
  if (globalData) return globalData;
  globalData = await (await fetch(`${location.origin}/api/post/list`)).json();
  return globalData!;
};
