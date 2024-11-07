<template>
  <div class="tag-editor flex text-sm px-4">
    <div
      v-for="tag in modelValue"
      :key="tag"
      class="rounded hover:bg-gray-200 px-3 py-1 cursor-pointer relative group"
    >
      <button
        class="opacity-0 group-hover:opacity-100 absolute bg-red top-0 right-0 w-3 h-3 rounded-full flex items-center justify-center"
        @click="() => toRemove(tag)"
      >
        <div class="i-ri:close-line text-white"></div>
      </button>
      #{{ tag }}
    </div>
    <div
      class="rounded text-gray hover:bg-gray-200 px-2 py-1 cursor-pointer"
      @click="toAddTag"
    >
      #Add a Tag
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  modelValue: string[];
}>();
const emit = defineEmits<{
  (name: "update:modelValue", value: string[]): void;
}>();

const toAddTag = () => {
  const newTag = prompt("Input a tag name");
  if (!newTag) return;
  emit("update:modelValue", [...new Set([...props.modelValue, newTag])]);
};

const toRemove = (tag: string) => {
  emit(
    "update:modelValue",
    props.modelValue.filter((v) => v !== tag)
  );
};
</script>
