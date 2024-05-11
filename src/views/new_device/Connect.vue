<script setup lang="ts">
import { useNewDeviceStore } from "@/store/new_device";
import ConfigureSection from "@/components/new_device/ConfigureSection.vue";

const newDeviceStore = useNewDeviceStore();
</script>

<template>
  <VForm v-bind:disabled="!newDeviceStore.is_idle">
    <VContainer>
      <h1>2. Connect to the device</h1>
      <ConfigureSection
        :conf_info="newDeviceStore.conn_conf_info"
        v-model="newDeviceStore.conn_conf"
      ></ConfigureSection>

      <VBtn
        :loading="!newDeviceStore.is_idle"
        :disabled="
          !newDeviceStore.start_init_available || !newDeviceStore.is_idle
        "
        @click.stop="newDeviceStore.connect_device()"
        >Connect</VBtn
      >
    </VContainer>
  </VForm>
</template>
