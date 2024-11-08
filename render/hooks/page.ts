import { onServerPrefetch, ref } from "vue";
import { useRoute } from "vue-router";
import { EnPageData } from "../reader";

export const SHORTED_PAGE_DATA_INJECT_KEY = "__page_data";

export const usePageData = () => {
  const data = ref<EnPageData>();
  const prefetch = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { default: result } = await import("./virtual:PrivateSSRData:home");
    data.value = result;
  };
  if (data.value === undefined) {
    prefetch();
  }
  onServerPrefetch(prefetch);
  return data;
};

export const usePage = () => {
  const data = ref<EnPageData["pageData"][number]>();
  const route = useRoute();
  const prefetch = async () => {
    console.log("prefetched");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const { default: result } = await import(/* @vite-ignore */ `./virtual:PrivateSSRData:page:${route.params.id}`);
    data.value = result;
  };
  if (data.value === undefined) {
    prefetch();
  }
  console.log("before create: data:", data.value);
  onServerPrefetch(async () => {
    await prefetch();
  });
  return data;
};

// export const PAGE_INJECT_KEY = "__page_data";

// export const _usePageData = () => {
//   const data = inject<EnPageData>(PAGE_INJECT_KEY, { pageData: [], tags: [] });
//   return data;
// };

// export const usePage = () => {
//   const { pageData: data } = usePageData();
//   const route = useRoute();
//   const page = computed(() => {
//     // vue router 会自动把地址栏中的id参数decodeURIComponent
//     const p = data.find((v) => v.id === encodeURIComponent(route.params.id as string));
//     if (!p) return undefined;
//     return {
//       ...p,
//     };
//   });
//   return page;
// };
