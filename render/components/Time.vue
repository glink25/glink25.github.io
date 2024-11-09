<template>
  <div>{{ formatSecond(time) }}</div>
</template>
<script lang="ts" setup>
import { formatSecond } from "@/shared/time";

defineProps<{
  time: number;
}>();
</script>
