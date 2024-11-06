import { getHTML } from "@/editor";
import type { PageData } from "@/shared/type";
import { inject } from "vue";
import { useRoute } from "vue-router";

export const PAGE_INJECT_KEY = "__page_data";

export const usePageData = () => {
  const data = inject<PageData[]>(PAGE_INJECT_KEY, []);
  return data;
};

export const usePage = () => {
  const data = usePageData();
  const route = useRoute();
  // vue router 会自动把地址栏中的id参数decodeURIComponent
  const page = data.find((v) => v.id === encodeURIComponent(route.params.id as string));
  if (!page) {
    throw new Error("no page founded");
  }
  const json = JSON.parse(page.content);
  console.log(json, "js");
  const html = getHTML(json, true);
  return { ...page, html };
};
