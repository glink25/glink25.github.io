<template>
  <div class="flex flex-col items-center">
    <Teleport defer to=".header-operations">
      <AddButton />
    </Teleport>
    <div
      class="w-full h-40 bg-black text-white font-bold text-3xl flex items-center justify-center"
    >
      Urodele
    </div>
    <div class="flex flex-col justify-center px-4 w-full max-w-[720px] pb-10">
      <router-link
        v-for="(item, index) in list"
        :key="index"
        :to="`/pages/${item.id}`"
        class="px-4 py-8 flex flex-col shadow-[0px_-1px_1px_rgba(0,0,0,0.1)] group"
      >
        <div class="text-lg transition-all font-semibold group-hover:underline">
          {{ item.title }}
        </div>
        <div class="text-black text-opacity-60">{{ item.intro }}</div>
        <div class="flex pt-2 gap-2">
          <RouterLink
            v-for="tag in item.tags"
            :key="tag"
            :to="`/tags/${encodeURIComponent(tag)}`"
            class="text-sm text-gray"
            >#{{ tag }}</RouterLink
          >
        </div>
      </router-link>
      <div
        class="flex justify-between items-center text-blue text-sm"
        @click="handleClickLoadMore"
      >
        <RouterLink v-if="loadMoreVisible" :to="`/${page + 1}`"
          >Load More</RouterLink
        >
        <RouterLink v-if="goHomeVisible" :to="`/`">To home</RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import AddButton from "./components/AddButton.vue";
import { usePageData } from "./hooks/page";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const page = computed(() => Number(route.params.page ?? 0));

const pageSize = 10;

const { pageData } = usePageData();
const list = computed(() =>
  pageData.slice(page.value * pageSize, page.value * pageSize + pageSize)
);

const pageCount = Math.ceil(pageData.length / pageSize);

const loadMoreVisible = computed(() => page.value < pageCount - 1);
const goHomeVisible = computed(() => page.value !== 0);

const handleClickLoadMore = () => {
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
