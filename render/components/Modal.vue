<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed w-full h-full left-0 top-0 z-[1000] flex justify-center items-center">
      <div
        class="w-full h-full bg-black bg-opacity-60 absolute z-[0]"
        @click="
          () => {
            modalClose && $emit('update:visible', false);
          }
        "></div>
      <div class="rounded bg-white p-2 z-[1]">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    visible: boolean;
    modalClose?: boolean;
  }>(),
  { modalClose: true }
);

defineEmits<{
  (name: "update:visible", v: boolean): void;
}>();
</script>
