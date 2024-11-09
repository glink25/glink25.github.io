<template>
  <div class="tag-editor flex text-sm px-4 gap-2">
    <div
      v-for="tag in modelValue"
      :key="tag"
      class="rounded px-3 py-1 cursor-pointer relative group tag"
    >
      <button
        class="opacity-0 transition-delay-[0.25s] group-hover:opacity-100 absolute bg-red top-0 right-0 w-3 h-3 rounded-full flex items-center justify-center"
        @click="() => toRemove(tag)"
      >
        <div class="i-ri:close-line text-white"></div>
      </button>
      #{{ tag }}
    </div>
    <div class="relative add-tag" tabindex="-1">
      <button
        class="rounded text-gray hover:bg-gray-200 px-2 py-1 cursor-pointer"
      >
        #Add a Tag
      </button>
      <div class="absolute z-[50] tag-selector">
        <div class="flex flex-col bg-white shadow-md rounded p-2 gap-2 text-sm">
          <div class="flex items-center justify-center gap-2">
            <input
              v-model="newTag"
              type="text"
              class="border px-2 py-1 rounded border-blue w-[180px]"
              placeholder="Create new Tag"
            />
            <button class="text-button text-blue" @click="toAddTag">Add</button>
          </div>
          <template v-if="data">
            <button
              v-for="tag in tags"
              :key="tag"
              class="text-button text-gray hover:text-black"
            >
              #{{ tag }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useShortPageData } from "../hooks/page";

const props = defineProps<{
  modelValue: string[];
}>();
const emit = defineEmits<{
  (name: "update:modelValue", value: string[]): void;
}>();

const newTag = ref("");
const toAddTag = (e: MouseEvent) => {
  if (!newTag) return;
  emit("update:modelValue", [...new Set([...props.modelValue, newTag.value])]);
  newTag.value = "";
  (e.target as HTMLElement)?.blur();
};

const data = useShortPageData();
const tags = computed(
  () => data?.tags.filter((t) => !props.modelValue.includes(t)) ?? []
);

const toRemove = (tag: string) => {
  emit(
    "update:modelValue",
    props.modelValue.filter((v) => v !== tag)
  );
};
</script>
<style lang="scss" scoped>
.tag {
  transition: all ease 0.25s;
  transition-delay: 0.25s;
  --opacity: 0;
  --stop: 0%;
  background: linear-gradient(
    90deg,
    rgba(229, 231, 235, var(--opacity)) 50%,
    rgb(248 113 113 / 1) 50%,
    rgb(248 113 113 / 1) 100%
  );
  background-position: 0%;
  background-size: 200%;
  &:hover {
    --opacity: 1;
    background-position: 100%;
    color: white;
  }
}

.add-tag {
  .tag-selector {
    display: none;
  }
  &:focus-within {
    .tag-selector {
      display: block;
    }
  }
}
</style>
