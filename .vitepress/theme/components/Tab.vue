<script lang="ts" setup scoped>
const props = defineProps<{ list: any[]; modelValue: any }>();
const emits = defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="tab">
    <div
      v-for="(item, index) in props.list"
      class="item"
      :class="{ selected: item === props.modelValue }"
      :key="index"
      @click="
        () => {
          emits('update:modelValue', item);
        }
      "
    >
      {{ item }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tab {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  .item {
    padding: 0 5px;
    opacity: 0.5;
    transition: all ease 0.08s;
    cursor: pointer;
    &.selected {
      border-bottom: 1px solid var(--primary-color);
      opacity: 1;
      font-size: large;
    }
  }
}
</style>
