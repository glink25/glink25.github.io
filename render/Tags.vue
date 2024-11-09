<template>
  <div class="flex flex-col w-full items-center justify-center px-4">
    <div v-if="!tag" class="flex flex-wrap w-full max-w-[720px] gap-4">
      <RouterLink
        v-for="tag in tags"
        :key="tag"
        :to="`/tags/${encodeURIComponent(tag)}`"
        class="text-4xl text-black text-opacity-60 hover:text-opacity-100"
      >
        #{{ tag }}
      </RouterLink>
    </div>
    <template v-else>
      <div class="w-full max-w-[720px]">
        <div class="flex justify-between">
          <div class="text-4xl">#{{ tag }}</div>
          <div>{{ list.length }}</div>
        </div>
        <router-link
          v-for="(item, index) in list"
          :key="index"
          :to="`/pages/${item.id}`"
          class="px-4 py-8 flex flex-col shadow-[0px_1px_0px_rgba(0,0,0,0.1)] group"
        >
          <div
            class="text-lg transition-all font-semibold group-hover:underline"
          >
            {{ item.title }}
          </div>
          <div class="text-gray">{{ item.intro }}</div>
          <ClientOnly
            ><Time :time="item.updateTime" class="text-end text-xs text-gray"
          /></ClientOnly>
        </router-link>
      </div>
    </template>
    <RouterLink v-if="tag" to="/tags" class="mt-4 text-blue"
      >All Tags</RouterLink
    >
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { usePageData } from "./hooks/page";
import { computed } from "vue";
import Time from "./components/Time.vue";

const data = usePageData();
const route = useRoute();
const tag = computed(() => (route.params.tag as string) ?? undefined);
const tags = computed(() => data.value?.tags ?? []);

const list = computed(() =>
  tag.value
    ? (data.value?.pageData.filter((p) => p.tags.includes(tag.value)) ?? [])
    : []
);
</script>
