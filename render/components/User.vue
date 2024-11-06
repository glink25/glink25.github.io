<template>
  <template v-if="isLogin">
    <div>user</div>
  </template>
  <template v-else>
    <Login />
  </template>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Modal from "./Modal.vue";
import Login from "./Login.vue";

import { useUser } from "../hooks/user";

const { isLogin } = useUser();
</script>
