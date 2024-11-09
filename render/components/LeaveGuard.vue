<template>
  <Modal v-model:visible="guardVisible">
    <div class="flex flex-col p-4 gap-2">
      <div>Are you sure to leave?</div>
      <div>changed you made may not be saved</div>
      <div class="flex items-center justify-end gap-2">
        <button class="text-button" @click="cancel">cancel</button>
        <button class="buttoned bg-blue" @click="leave">leave</button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import Modal from "./Modal.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  safe: boolean;
}>();

const guardVisible = ref(false);
const router = useRouter();

let _res: any;
let _rej: any;
const cancel = () => {
  _rej?.();
};
const leave = () => {
  _res?.();
};
// router.beforeEach(async () => {
//   if (props.safe) {
//     return true;
//   }
//   try {
//     await new Promise((res, rej) => {
//       guardVisible.value = true;
//       _res = res;
//       _rej = rej;
//     });
//     return true;
//   } catch (error) {
//     return false;
//   } finally {
//     guardVisible.value = false;
//   }
// });

onMounted(() => {
  const guard = (e: Event) => {
    if (props.safe) return true;
    e.preventDefault();
    return false;
  };
  window.addEventListener("beforeunload", guard);
  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", guard);
  });
});
</script>
