<script setup lang="ts">
import { RouterView } from "vue-router";

import { useAppStore } from "../store/app";
import { useCounterStore } from "../store/counter";

const appStore = useAppStore();
const counterStore = useCounterStore();
</script>

<template>
  <div>This is Pavourites page</div>
  <div>Counter val is {{ counterStore.counter }}</div>
  <VBtn @click="counterStore.increment">Increase counter</VBtn>
</template>

<style scoped></style>
