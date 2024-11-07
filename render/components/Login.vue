<template>
  <button @click="toLogin">Login</button>
  <Modal :visible="visible">
    <div>
      <div>Enter your github token:</div>
      <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">here to go</a>
      <input v-model="token" type="text" placeholder="paste your token here" />
      <button @click="toConfirm">confirm</button>
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
