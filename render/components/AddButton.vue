<template>
  <template v-if="canEdit">
    <RouterLink to="/edit?new" class="text-button">
      <div class="i-ri:add-large-line"></div>
    </RouterLink>
  </template>
</template>
<script lang="ts" setup>
import { useUser } from "../hooks/user";

const { canEdit } = useUser();
</script>
