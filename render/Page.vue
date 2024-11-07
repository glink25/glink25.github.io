<template>
  <template v-if="page">
    <Teleport defer to=".header-operations">
      <EditButton />
    </Teleport>
    <div class="px-4 flex justify-center">
      <div v-html="page.html" class="ud-root read-only"></div>
    </div>
  </template>
</template>
<script lang="ts" setup>
import EditButton from "./components/EditButton.vue";
import { usePage } from "./hooks/page";
import "@/editor/style.scss";

const page = usePage();
</script>
