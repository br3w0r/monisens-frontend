<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
</script>

<template>
  <VAppBar app elevation="1">
    <VTabs>
      <VTab prepend-icon="mdi-chart-box-outline" to="graphs">Graphs</VTab>
      <VTab prepend-icon="mdi-camera-control" to="control">Control Panel</VTab>
    </VTabs>

    <template v-slot:append>
      <!-- TODO -->
    </template>
  </VAppBar>

  <RouterView />
</template>
