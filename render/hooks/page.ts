import type { EnPageData, ShortPageData } from "@/shared/type";
import { inject, onServerPrefetch, ref } from "vue";
import { useRoute } from "vue-router";

export const SHORTED_PAGE_DATA_INJECT_KEY = "__page_data";

export const usePageData = () => {
  const data = ref<EnPageData>();
  const prefetch = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { default: result } = await import("v:ssr-inject:home");
    data.value = result;
  };
  if (data.value === undefined) {
    prefetch();
  }
  onServerPrefetch(prefetch);
  return data;
};

export const useShortPageData = () => {
  const data = inject<ShortPageData>(SHORTED_PAGE_DATA_INJECT_KEY)
  return data
}

export const usePage = () => {
  const data = ref<EnPageData["pageData"][number]>();
  const route = useRoute();
  const prefetch = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const loader = await import('v:ssr-inject:loader');
    const result = await loader.loadPage(route.params.id)
    data.value = result.default;
  };
  if (data.value === undefined) {
    prefetch();
  }
  onServerPrefetch(async () => {
    await prefetch();
  });
  return data;
};
