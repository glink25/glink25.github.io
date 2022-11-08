<script lang="ts" setup>
import { useData, useRouter, useRoute } from "vitepress";
import { ref, computed } from "vue";
import { CustomThemeConfig } from "@/shared";
import FriendLink from "./components/FriendLink.vue";
import Search from "./components/Search.vue";

import Tab from "./components/Tab.vue";
import { useCustomConfig } from "./hooks/useCustomConfig";

const { site } = useData<CustomThemeConfig>();
const { isHomeLayout, categories, friendLinks, apiOption } = useCustomConfig()

const router = useRouter();
const route = useRoute();
const currentTab = computed({
  get: () => {
    return categories.value.find((cat) => route.path.includes(cat.folder))?.title;
  },
  set: (v) => {
    router.go(categories.value.find((cat) => cat.title === v)?.folder);
  },
});
</script>
<template>
  <div class="sticky top-0 z-2 h-12 w-full border-b bg-background" :class="{ homed: isHomeLayout }">
    <div class="w-full h-full flex items-center justify-center relative">
      <a class="absolute left-2 font-bold" href="/">
        <div class="relative flex items-center">
          <div class="back"><i class="icon-chevron-left"></i></div>
          {{ site.title }}
        </div>
      </a>
      <Tab v-if="isHomeLayout" v-model="currentTab" :list="categories.map((cat) => cat.title)"></Tab>
      <div v-if="isHomeLayout" class="absolute right-2 flex items-center">
        <Search v-if="apiOption" />
        <FriendLink v-if="friendLinks?.length ?? 0 > 0" :list="friendLinks" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.back {
  transition: all ease-in-out 0.2s;
  transform: translateX(0);
}

.homed {
  .back {
    transform: translateX(-10px);
    opacity: 0;

  }
}
</style>
