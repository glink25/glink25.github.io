<template>
  <template v-if="isLogin">
    <Profile />
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
import Profile from "./Profile.vue";

const { isLogin, user } = useUser();
</script>
