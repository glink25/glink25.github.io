<script setup lang="ts">
import { useData } from "vitepress";
import { ref, computed, onMounted } from "vue";
import useDynamicThemeColor from "../utils/theme-color";
import Header from "./Header.vue";
import Home from "./Home.vue";
import Page from "./Page.vue";
import { CustomThemeConfig } from "./type";
const { site, page } = useData<CustomThemeConfig>();

const isHome = computed(() => page.value.frontmatter.home);
const catagories =
  site.value.themeConfig.catagories?.map((cat) => cat.title) ?? [];
const currentTab = ref(catagories[0]);

useDynamicThemeColor();
</script>
<template>
  <Header v-model:currentTab="currentTab"></Header>
  <Home v-show="isHome" :current-tab="currentTab"></Home>
  <Page v-show="!isHome"></Page>
</template>
<style lang="scss">
@import "./styles/variables.scss";
@import "./styles/index.scss";
body {
  background-color: var(--bg-color);
}
</style>
