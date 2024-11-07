import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { EnPageData } from "../reader";

export const PAGE_INJECT_KEY = "__page_data";

export const usePageData = () => {
  const data = inject<EnPageData>(PAGE_INJECT_KEY, { pageData: [], tags: [] });
  return data;
};

export const usePage = () => {
  const { pageData: data } = usePageData();
  const route = useRoute();
  const page = computed(() => {
    // vue router 会自动把地址栏中的id参数decodeURIComponent
    const p = data.find((v) => v.id === encodeURIComponent(route.params.id as string));
    if (!p) return undefined;
    return {
      ...p,
    };
  });
  return page;
};
