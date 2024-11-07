<template>
  <template v-if="user">
    <div class="w-6 h-6 rounded-full" @click="toShowProfile">
      <img :src="user?.avatar" alt="" class="rounded-full" />
    </div>
    <Modal v-model:visible="visible">
      <div>
        <button @click="toLogOut">log out</button>
      </div>
    </Modal>
  </template>
</template>
<script lang="ts" setup>
import Modal from "./Modal.vue";

import { useUser } from "../hooks/user";
import { ref } from "vue";

const { user } = useUser();
const visible = ref(false);

const toShowProfile = () => {
  visible.value = true;
};

const toLogOut = () => {
  visible.value = false;
  localStorage.clear();
  location.reload();
};
</script>
