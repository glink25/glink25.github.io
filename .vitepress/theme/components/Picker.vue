<script setup lang="ts">
import { ref } from "vue";
import clickOutside from "../directives/clickOutside";
defineProps<{ list: string[] }>();
const emits = defineEmits(["choose"]);
const popupVisible = ref(false);

const vClickOutside = clickOutside;
</script>
<template>
  <div class="picker">
    <div class="content" @click="() => (popupVisible = !popupVisible)">
      <slot></slot>
    </div>
    <transition name="slide-fade">
      <div
        v-if="popupVisible"
        v-click-outside="() => (popupVisible = false)"
        class="popup"
      >
        <div
          v-for="(item, i) in list"
          class="item"
          :key="i"
          @click="
            () => {
              emits('choose', item, i);
              popupVisible = false;
            }
          "
        >
          {{ item }}
        </div>
      </div>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/utils.scss";
.picker {
  position: relative;
  .popup {
    position: absolute;
    top: 0;
    right: 0;
    width: max-content;
    min-width: 100px;
    min-height: 50px;
    background-color: var(--bg-color);
    border-radius: 2px;
    @include shadowed();
    transition: all 0.2s ease;
    color: var(--primary-color);
    padding: 5px;
    font-size: small;
    .item {
      @include buttoned();
      padding: 10px 5px;
      font-weight: 500;
      &:hover {
        filter: brightness(0.8);
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right top;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right top;
}
.slide-fade-enter-from, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: scale(0.2);
  opacity: 0;
}
</style>
