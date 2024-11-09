<template>
  <template v-if="page">
    <Teleport defer to=".header-operations">
      <EditButton />
    </Teleport>
    <div class="px-4 flex flex-col justify-center items-center">
      <div class="w-full flex max-w-[720px]">
        <RouterLink
          :to="`/tags/${encodeURIComponent(tag)}`"
          v-for="tag in page.tags"
          :key="tag"
          class="rounded hover:bg-gray-200 px-3 py-1 cursor-pointer"
        >
          #{{ tag }}
        </RouterLink>
      </div>
      <div v-html="page.html" class="ud-root read-only"></div>
      <div class="w-full max-w-[720px] py-4 flex flex-col gap-4">
        <div class="w-full text-end text-gray text-xs">
          Last update at: {{ updateTime }}
        </div>
        <div class="flex justify-between items-center text-sm">
          <RouterLink
            :class="[
              'flex items-center gap-1 text-blue cursor-pointer',
              !prev && 'w-0 overflow-hidden',
            ]"
            :to="`/pages/${prev?.id}?fromTag=${encodeURIComponent(fromTag ?? '')}`"
          >
            <div class="i-ri:arrow-left-double-line w-5 h-5"></div>
            <div>{{ prev?.title }}</div>
          </RouterLink>
          <RouterLink
            :class="[
              'flex items-center gap-1 text-blue cursor-pointer',
              !next && 'w-0 overflow-hidden',
            ]"
            :to="`/pages/${next?.id}?fromTag=${encodeURIComponent(fromTag ?? '')}`"
          >
            <div>{{ next?.title }}</div>
            <div class="i-ri:arrow-right-double-line w-5 h-5"></div>
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import EditButton from "./components/EditButton.vue";
import { usePage, useShortPageData } from "./hooks/page";
import "@/editor/style.scss";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import slugify from "slugify";

const page = usePage();
const realId = computed(() => (page.value ? page.value.id : undefined));

const updateTime = computed(() =>
  dayjs(page.value?.updateTime).format("YYYY/MM/DD HH:mm")
);

const short = useShortPageData();

const route = useRoute();
const fromTag = computed(() =>
  route.query.fromTag
    ? decodeURIComponent(route.query.fromTag as string)
    : undefined
);
const curIndex = computed(() => {
  return short?.pageData.findIndex((v) => v.id === realId.value);
});

const prev = computed(() => {
  if (curIndex.value === undefined) return undefined;
  const ft = fromTag.value;
  if (!ft) {
    return short?.pageData[curIndex.value - 1];
  }
  for (let i = curIndex.value - 1; i >= 0; i -= 1) {
    const el = short?.pageData[i];
    if (el?.tags.includes(fromTag.value)) {
      return el;
    }
  }
});

const next = computed(() => {
  const ft = fromTag.value;
  if (curIndex.value === undefined) return;
  if (!ft) {
    return short?.pageData[curIndex.value + 1];
  }
  return short?.pageData
    .slice(curIndex.value + 1)
    .find((v) => v.tags.includes(ft));
});

watchEffect(() => {
  console.log(
    "debug:",
    page.value?.id,
    curIndex.value,
    prev.value,
    next.value,
    short
  );
});
</script>
