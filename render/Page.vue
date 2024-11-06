<template>
  <div>page</div>
  <RouterLink :to="`/edit?id=${data?.id}`">edit</RouterLink>
  <div v-html="data.html" class="ud-root"></div>
</template>
<script lang="ts" setup>
import { usePage } from "./hooks/page";
import "@/editor/style.scss";

const data = usePage();
</script>
