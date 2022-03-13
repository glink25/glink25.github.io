<script lang="ts" setup>
import { ref } from "vue";
const num = ref(0);
</script>
<template>
  <button @click="num += 1">{{ num }}</button>
</template>
