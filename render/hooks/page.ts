import type { PageData } from "@/shared/type";
import { computed, ref } from "vue";
import { useSSRGlobalData, useSSRRouteData } from "@/adapter/ssr-client";

export const SHORTED_PAGE_DATA_INJECT_KEY = "__page_data";

export const usePageData = () => {
  const data = useSSRGlobalData()
  const wrap = ref(data as { pageData: (PageData & { intro: string })[] })
  return wrap
};

export const usePage = () => {
  const data = useSSRRouteData()
  return computed(() => data.value.page)
};
