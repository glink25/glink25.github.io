<script lang="ts" setup scoped>
const props = defineProps<{ list: any[]; modelValue: any }>();
const emits = defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="flex items-center">
    <div v-for="(item, index) in props.list" class="px-2 opacity-50 cursor-pointer"
      :class="{ 'opacity-100 font-bold text-lg': item === props.modelValue }" :key="index" @click="
        () => {
          emits('update:modelValue', item);
        }
      ">
      {{ item }}
    </div>
  </div>
</template>
