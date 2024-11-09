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
      <input
        v-model="token"
        type="text"
        placeholder="paste your token here"
        class="rounded border px-2 py-1 text-sm"
      />
      <button
        class="buttoned bg-blue"
        :disabled="disabled"
        :data-loading="loading"
        @click="toConfirm"
      >
        confirm
      </button>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import Modal from "./Modal.vue";
import { useUser } from "../hooks/user";

const { login } = useUser();
const token = ref("");
const visible = ref(false);
const toLogin = () => {
  visible.value = true;
};

const loading = ref(false);
const disabled = computed(() => loading.value || !token.value);
const toConfirm = async () => {
  loading.value = true;
  try {
    await login(token.value);
    location.reload();
  } finally {
    loading.value = false;
  }
};
</script>
