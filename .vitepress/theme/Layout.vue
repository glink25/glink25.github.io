<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import { ref, computed, onMounted } from "vue";
import useDynamicThemeColor from "../utils/theme-color";
import Header from "./Header.vue";
import Home from "./Home.vue";
import Page from "./Page.vue";
import { CustomThemeConfig } from "./type";
const { site, page } = useData<CustomThemeConfig>();

const isHome = computed(() => page.value.frontmatter.home);
const catagories = site.value.themeConfig.catagories;

useDynamicThemeColor();

const route = useRoute();
const currentTab = computed(
  () => catagories?.find((cat) => route.path.includes(cat.folder))?.title ?? ""
);
</script>
<template>
  <Header></Header>
  <Home v-show="isHome" :current-tab="currentTab"></Home>
  <Page v-show="!isHome"></Page>
</template>
<style lang="scss">
@import "./styles/index.scss";
</style>
