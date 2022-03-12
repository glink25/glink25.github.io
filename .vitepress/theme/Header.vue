<script lang="ts" setup>
import { useData } from "vitepress";
import { ref, computed } from "vue";
import Picker from "./components/Picker.vue";
import { CustomThemeConfig } from "./type";
import Tab from "./components/Tab.vue";
const props = defineProps<{ currentTab: string }>();
const emits = defineEmits(["update:currentTab"]);

const { site, page } = useData<CustomThemeConfig>();
const isHome = computed(() => page.value.frontmatter.home);
const friendLinks = site.value.themeConfig.friendLinks;
const catagories =
  site.value.themeConfig.catagories?.map((cat) => cat.title) ?? [];
const currentTab = computed({
  get: () => props.currentTab,
  set: (v) => emits("update:currentTab", v),
});

const openLink = (url?: string) => {
  window.open(url, "_blank");
};
</script>
<template>
  <div class="header" :class="{ homed: isHome }">
    <a class="header-title" href="/">{{ site.title }}</a>
    <Tab v-show="isHome" v-model="currentTab" :list="catagories"></Tab>
    <Picker
      v-show="isHome && (friendLinks?.length ?? 0 > 0)"
      :list="friendLinks?.map((f) => f.title) ?? []"
      @choose="
        (_, i) => {
          openLink(friendLinks?.[i]?.href);
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

    display: flex;
    text-decoration: none;
    &::before {
      content: "<";
      display: block;
      width: 15px;
      transform: translateX(0);
      transition: all ease-in-out 0.2s;
    }
  }
  .header-more {
    width: 100px;
    text-align: end;
  }
  &.homed {
    .header-title::before {
      transform: translateX(-10px);
      opacity: 0;
    }
  }
}
</style>
