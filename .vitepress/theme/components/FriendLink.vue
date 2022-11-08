<script setup lang="ts">
import { FriendLinkType } from "@/shared";
import Popover from "./Popover.vue";

defineProps<{ list?: FriendLinkType[] }>();
</script>
<template>
  <Popover trigger="focus-within" placement="bottom-right" offset="8px">
    <div
      class="w-8 h-8 flex justify-center items-center cursor-pointer buttoned rounded-full"
    >
      <i class="icon-more-alt"></i>
    </div>
    <template #overlay>
      <div class="bg-background w-200px shadow">
        <a
          v-for="(item, i) in list"
          class="block w-full p-2 text-sm buttoned"
          :key="i"
          :href="item.href"
          target="_blank"
        >
          {{ item.title }}
        </a>
      </div>
    </template>
  </Popover>
</template>
