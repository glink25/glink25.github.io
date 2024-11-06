<template>
  <div>hello my post</div>
  <ClientOnly>
    <User />
  </ClientOnly>
  <router-link v-for="(item, index) in pageData" :key="index" :to="`/pages/${item.id}`">
    {{ item.title }}
  </router-link>
</template>
<script setup lang="ts">
import User from "./components/User.vue";
import { usePageData } from "./hooks/page";

const pageData = usePageData();
</script>
