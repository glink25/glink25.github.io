<script lang="ts" setup>
import { computed } from "vue";
import { formatDate } from "@/shared";
import { useCustomConfig } from "./hooks/useCustomConfig";

const props = defineProps<{ currentTab: string }>();

const { categories } = useCustomConfig()

const pages = computed(() =>
  categories.value
    ?.find((cat) => cat.title === props.currentTab)
    ?.pages.filter((p) => p.frontMatter.layout !== 'home')
);

</script>
<template>
  <div class="flex flex-col items-center">
    <div class="w-full h-40 bg-brand flex items-center justify-center"><span
        class="text-3xl font-bold text-white">Glink</span>
    </div>
    <div class="divide-y max-w-800px w-full">
      <div v-for="(page, index) in pages" :key="index" class="p-2 relative h-90px">
        <a :href="`${page.regularPath}`" class="w-full h-full">
          <div class="title">{{ page.title }}</div>
          <div class="opacity-40 text-sm">
            {{ page.frontMatter.description }}
          </div>
          <div class="absolute right-0 bottom-0 text-sm">
            {{ formatDate(page.createTime) }}
          </div>
        </a>
      </div>
    </div>
    <div class="footer">
      <a href="https://github.com/glink25" target="_blank">
        Github
      </a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.title {
  font-weight: bold;
  font-size: large;

  &::after {
    content: "";
    display: block;
    width: 0;
    height: 2px;
    background-color: red;
    transition: all ease-in-out 0.2s;
  }

  &:hover {
    &::after {
      width: 20%;
    }
  }
}
</style>
