<template>
  <div>
    <Header />
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import Header from "./components/Header.vue";
import "./index.scss";
</script>
