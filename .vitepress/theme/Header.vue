<script lang="ts" setup>
import { useData, useRouter, useRoute } from "vitepress";
import { ref, computed } from "vue";
import Picker from "./components/Picker.vue";
import { CustomThemeConfig } from "./type";
import Tab from "./components/Tab.vue";

const { site, page } = useData<CustomThemeConfig>();
const isHome = computed(() => page.value.frontmatter.home);
const friendLinks = site.value.themeConfig.friendLinks;
const catagories = site.value.themeConfig.catagories ?? [];

const router = useRouter();
const route = useRoute();
const currentTab = computed({
  get: () => {
    return catagories.find((cat) => route.path.includes(cat.folder))?.title;
  },
  set: (v) => {
    router.go(catagories.find((cat) => cat.title === v)?.folder);
  },
});
</script>
<template>
  <div class="header" :class="{ homed: isHome }">
    <a class="header-title iconfont" href="/">{{ site.title }}</a>
    <Tab
      v-show="isHome"
      v-model="currentTab"
      :list="catagories.map((cat) => cat.title)"
    ></Tab>
    <Picker
      v-show="isHome && (friendLinks?.length ?? 0 > 0)"
      :list="friendLinks?.map((f) => f.title) ?? []"
      @choose="
        (_, i) => {
          router.go(friendLinks?.[i]?.href);
        }
      "
    >
      <div class="header-more">...</div></Picker
    >
  </div>
</template>
<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 50px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: var(--bg-color);
  font-weight: bolder;

  .header-title {
    width: 100px;
    color: var(--primary-color);
    font-family: var(--font-family-base);
    display: flex;
    text-decoration: none;
    font-weight: 800;
    &::before {
      font-family: "iconfont";
      content: "\e606";
      display: block;
      width: 15px;
      transform: translateX(0);
      transition: all ease-in-out 0.2s;
    }
  }
  .header-more {
    width: 100px;
    text-align: end;
    cursor: pointer;
  }
  &.homed {
    .header-title::before {
      transform: translateX(-10px);
      opacity: 0;
    }
  }
}
</style>
