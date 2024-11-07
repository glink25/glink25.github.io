<template>
  <div>
    <Header />
    <div>
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Header from "./components/Header.vue";
</script>
