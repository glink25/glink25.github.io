<template>
  <div class="flex justify-between items-center p-2 h-10">
    <RouterLink to="/" class="text-button">
      <div class="i-ri:menu-4-fill"></div>
    </RouterLink>
    <div class="flex gap-2 items-center header-operations">
      <div class="order-[4]">
        <ClientOnly>
          <User />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import User from "./User.vue";
</script>
