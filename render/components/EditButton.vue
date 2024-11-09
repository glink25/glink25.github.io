<template>
  <template v-if="page && canEdit">
    <RouterLink
      :to="`/edit?path=${encodeURIComponent(page?.path)}`"
      class="text-button"
    >
      <div class="i-ri:quill-pen-fill"></div>
    </RouterLink>
  </template>
</template>
<script setup lang="ts">
import { usePage } from "../hooks/page";
import { useUser } from "../hooks/user";

const page = usePage();
const { canEdit } = useUser();
</script>
