<template>
  <Popover trigger="focus-within" placement="bottom-right" offset="5px">
    <div
      class="w-8 h-8 flex items-center buttoned rounded-full search overflow-hidden hover:(w-20) focus-within:(w-50 bg-stone-200 dark:bg-stone-700)"
    >
      <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
        <i class="w-2 h-2 icon-search"></i>
      </div>
      <div class="flex-1 flex items-center">
        <div class="flex-1">
          <input v-model="text" class="w-full" type="text" @input="toSearch" />
        </div>
        <div v-if="searching" class="w-8 h-8 flex items-center justify-center">
          <i class="icon-spinner-alt"></i>
        </div>
      </div>
    </div>
    <template #overlay>
      <div
        class="w-50 rounded shadow bg-white overflow-x-hidden max-h-100 overflow-y-auto"
      >
        <a
          v-for="(result, index) in results"
          :key="index"
          class="block buttoned px-2 py-1 text-sm"
          :href="result.relativePath"
        >
          {{ result.name }}
        </a>
      </div>
    </template>
  </Popover>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useSearch } from "@/theme/hooks/useSearch";
import Popover from "./Popover.vue";

const text = ref();

const { search, results, searching } = useSearch();

const toSearch = () => {
  search(text.value);
};
</script>
<style lang="scss" scoped>
// .search{
//     &:hover{
//         .search-input{
//             @apply w-10;
//         }
//     }
// }
</style>
