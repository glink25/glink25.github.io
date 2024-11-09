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
      <div class="w-full p-4 text-xs text-end text-gray">
        Last update at: {{ updateTime }}
      </div>
    </div>
  </template>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import EditButton from "./components/EditButton.vue";
import { usePage } from "./hooks/page";
import "@/editor/style.scss";
import { computed } from "vue";

const page = usePage();

const updateTime = computed(() =>
  dayjs(page.value?.updateTime).format("YYYY/MM/DD HH:mm")
);
</script>
