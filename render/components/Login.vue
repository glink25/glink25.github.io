<template>
  <button class="text-sm" @click="toLogin">Login</button>
  <Modal v-model:visible="visible">
    <div class="flex flex-col gap-2 p-4">
      <div>Enter your github token:</div>
      <a
        href="https://github.com/settings/personal-access-tokens/new"
        target="_blank"
        class="text-xs underline text-blue"
        >learn here</a
      >
      <input v-model="token" type="text" placeholder="paste your token here" class="rounded border px-2 py-1 text-sm" />
      <button class="text-sm bg-blue rounded px-2 py-1" @click="toConfirm">confirm</button>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Modal from "./Modal.vue";

const token = ref("");
const visible = ref(false);
const toLogin = () => {
  visible.value = true;
};

const toConfirm = () => {
  localStorage.setItem("github_token", token.value);
  location.reload();
};
</script>
