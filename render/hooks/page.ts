import type { EnPageData, PageData, ShortPageData } from "@/shared/type";
import { createHead, injectHead, Unhead, useHead } from "@unhead/vue";
import { computed, getCurrentInstance, inject, onServerPrefetch, Ref, ref, useSSRContext, watch } from "vue";
import { useRoute } from "vue-router";
import { useSSRRouteData } from "./ssr";
import { useSSRGlobalData } from "@/adapter/ssr-client";

export const SHORTED_PAGE_DATA_INJECT_KEY = "__page_data";

export const usePageData = () => {
  const data = useSSRGlobalData()
  console.log(data, "dadadad")
  const x = ref(data as { pageData: (PageData & { intro: string })[] })
  console.log(x.value, 'dsdsdsdxxx')
  return x
};

export const usePage = () => {
  const x = useSSRRouteData()
  console.log(x, "xxx")
  return computed(() => x.value.page)
};
