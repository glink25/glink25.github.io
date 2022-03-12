<script lang="ts" setup>
import { useData } from "vitepress";
const site = useData().site;
</script>
<template>
  <div class="theme">
    <h1>404</h1>
    <a :href="site.base" aria-label="go to home"> Take me home. </a>
  </div>
</template>
