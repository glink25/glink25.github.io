<template>
  <template v-if="user">
    <div class="w-6 h-6 rounded-full cursor-pointer" @click="toShowProfile">
      <img :src="user?.avatar" alt="" class="rounded-full" />
    </div>
    <Modal v-model:visible="visible">
      <div class="flex flex-col gap-2 p-4">
        <div class="text-lg">Are you sure to log out?</div>
        <div class="text-gray text-sm">
          Token will be clear, make sure you saved it elsewhere
        </div>
        <button class="buttoned bg-red" @click="toLogOut">log out</button>
      </div>
    </Modal>
  </template>
</template>
<script lang="ts" setup>
import Modal from "./Modal.vue";

import { useUser } from "../hooks/user";
import { ref } from "vue";

const { user, logout } = useUser();
const visible = ref(false);

const toShowProfile = () => {
  visible.value = true;
};

const toLogOut = () => {
  visible.value = false;
  logout();
  location.reload();
};
</script>
