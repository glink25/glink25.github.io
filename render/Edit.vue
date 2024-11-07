<template>
  <ClientOnly>
    <ClientEdit />
  </ClientOnly>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const ClientEdit = defineAsyncComponent(
  () => import("./components/ClientEdit.vue")
);
</script>
