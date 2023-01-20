<script setup lang="ts">
// import { useAppStore } from "../store/app";
import { useCounterStore } from "../store/counter";

const counterStore = useCounterStore();
</script>

<template>
  <div>This is Add New Device</div>
  <div>Counter val is {{ counterStore.counter }}</div>
</template>

<style scoped></style>
