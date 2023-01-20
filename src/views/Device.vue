<script setup lang="ts">
import { useAppStore } from "../store/app";

const appStore = useAppStore();
</script>

<template>
    <VAppBar app elevation="1">
      <VTabs>
        <VTab prepend-icon="mdi-chart-box-outline">Graphs</VTab>
        <VTab prepend-icon="mdi-camera-control">Control Panel</VTab>
      </VTabs>

      <template v-slot:append>
        <!-- TODO -->
      </template>
    </VAppBar>
    
    <div>
      Viewing device "{{ appStore.device_panel.cur_device?.name }}"
    </div>
</template>
