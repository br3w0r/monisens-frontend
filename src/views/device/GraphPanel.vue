<script setup lang="ts">
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
</script>

<template>
    <div>
      Graphs for device "{{ appStore.device_panel.cur_device?.name }}"
    </div>
</template>
