<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed w-full h-full left-0 top-0 z-[1000] flex justify-center items-center">
      <div class="w-full h-full bg-black bg-opacity-60 absolute z-[0]"></div>
      <div class="rounded bg-white p-2 z-[1]">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
defineProps<{
  visible: boolean;
}>();
</script>
