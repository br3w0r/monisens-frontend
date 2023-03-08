<script setup lang="ts">
import { RouterView } from "vue-router";

import { useAppStore } from "../store/app";

const appStore = useAppStore();
</script>

<template>
  <div>This is a Favourites page</div>
  <img src="../static/shrug.webp" />
</template>

<style scoped></style>
