<template>
  <template v-if="isLogin">
    <RouterLink to="/edit?new">
      <div class="i-ri:add-line"></div>
    </RouterLink>
  </template>
</template>
<script lang="ts" setup>
import { useUser } from "../hooks/user";

const { isLogin } = useUser();
</script>
