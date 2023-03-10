<script setup lang="ts">
import { useAppStore } from "../../store/app";
import { useNewDeviceStore } from "../../store/new_device";
import ConfigureSection from "../../components/new_device/ConfigureSection.vue";

const appStore = useAppStore();
const newDeviceStore = useNewDeviceStore();
</script>

<template>
  <VForm v-bind:disabled="!appStore.controller.is_idle">
    <h1>3. Configure device</h1>
    <ConfigureSection :conf_info="newDeviceStore.conf_info"></ConfigureSection>
    <VBtn
        :loading="!appStore.controller.is_idle"
        :disabled="
          !newDeviceStore.start_init_available || !appStore.controller.is_idle
        "
        @click.stop="newDeviceStore.configure_device()"
        >Configure</VBtn
      >
  </VForm>
</template>
