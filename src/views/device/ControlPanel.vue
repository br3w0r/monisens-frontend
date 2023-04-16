<script setup lang="ts">
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
</script>

<template>
    <div>
      Control panel for device "{{ appStore.current_device?.name }}"
    </div>
</template>
