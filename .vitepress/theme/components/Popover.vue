<template>
  <div ref="el" class="popover" :class="`trigger-${trigger}`" tabindex="0">
    <slot></slot>
    <div class="popover-overlay" :class="[placement]">
      <slot name="overlay"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useCssVar } from '@/theme/hooks/useCustomCssVar';

const props = withDefaults(
  defineProps<{
    trigger?: "hover" | "focus" | "focus-within";
    placement?: "bottom-left" | "bottom" | "bottom-right";
    delay?: string;
    offset?: string;
  }>(),
  {
    trigger: "hover",
    placement: "bottom",
    delay: "0s",
    offset: "0px",
  }
);

const el = ref<HTMLDivElement>();
const show = () => {
  el.value?.focus();
};
const blur = () => {
  el.value?.blur();
};

const offsetVar = computed(() => props.offset)
useCssVar(offsetVar, el, '--popover-offset')

defineExpose({
  show,
  blur,
});
</script>
<style lang="scss" scoped>
.popover {
  position: relative;

  &-overlay {
    position: absolute;
    z-index: 1;

    &.top-left {
      bottom: calc(100% + var(--popover-offset));
      left: 0;
    }

    &.top {
      bottom: calc(100% + var(--popover-offset));
      left: 50%;
      transform: translateX(-50%);
    }

    &.top-right {
      bottom: calc(100% + var(--popover-offset));
      right: 0;
    }

    &.bottom-left {
      top: calc(100% + var(--popover-offset));
      left: 0;
    }

    &.bottom {
      top: calc(100% + var(--popover-offset));
      left: 50%;
      transform: translateX(-50%);
    }

    &.bottom-right {
      top: calc(100% + var(--popover-offset));
      right: 0;
    }
  }

  @mixin hidden {
    pointer-events: none;
    transition: all ease-in-out 0.2s 0.2s;

    &.bottom,
    &.top {
      transform: translateX(-50%) translateY(-10px);
    }

    transform: translateY(-10px);
    opacity: 0;
  }

  @mixin visible {
    pointer-events: auto;

    &.bottom,
    &.top {
      transform: translateX(-50%) translateY(0);
    }

    transform: translateY(0px);
    opacity: 1;
  }

  &.trigger-hover {
    .popover-overlay {
      @include hidden();
    }

    &:hover {
      .popover-overlay {
        @include visible();
      }
    }
  }

  &.trigger-focus {
    .popover-overlay {
      @include hidden();
    }

    &:focus {
      .popover-overlay {
        @include visible();
      }
    }
  }

  &.trigger-focus-within {
    .popover-overlay {
      @include hidden();
    }

    &:focus,
    &:focus-within {
      .popover-overlay {
        @include visible();
      }
    }
  }
}
</style>
