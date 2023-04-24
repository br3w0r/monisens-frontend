<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
</script>

<template>
  <div v-if="appStore.current_device">
    <VAppBar app elevation="1">
      <VTabs>
        <VTab prepend-icon="mdi-chart-box-outline" to="graphs">Monitoring</VTab>
        <VTab prepend-icon="mdi-camera-control" to="control"
          >Control Panel</VTab
        >
      </VTabs>
    </VAppBar>

    <RouterView />
  </div>
  <div v-else>
    <h1>
      Device was not found :/
    </h1>
  </div>
</template>
