<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import { computed } from "vue";
import { CustomThemeConfig } from "@/shared";
import Header from "./Header.vue";
import Home from "./Home.vue";
import { useCustomConfig } from "./hooks/useCustomConfig";
import Page from "./Page.vue";

const { page } = useData<CustomThemeConfig>();

const isHome = computed(() => page.value.frontmatter.layout === 'home');
const { categories } = useCustomConfig()

const route = useRoute();
const currentTab = computed(
  () => categories.value?.find((cat) => route.path.includes(cat.folder))?.title ?? ""
);
</script>
<template>
  <Header></Header>
  <Home v-if="isHome" :current-tab="currentTab"></Home>
  <Page v-else></Page>
</template>
<style lang="scss">
@import "./styles/index.scss";
</style>
