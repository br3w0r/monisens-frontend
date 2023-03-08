<script setup lang="ts">
import { useAppStore } from "../store/app";
import { useNewDeviceStore } from "../store/new_device";
import { DeviceInitState } from "../controller/device_init";

const appStore = useAppStore();
const newDeviceStore = useNewDeviceStore();
</script>

<template>
  <VForm
    v-bind:disabled="!appStore.controller.is_idle"
    v-show="
      appStore.controller.device_init == null ||
      appStore.controller.device_init.init_state == DeviceInitState.None
    "
  >
    <!-- Start init -->
    <VContainer>
      <VTextField
        label="Device name"
        v-model="newDeviceStore.device_name"
        :active="appStore.controller.is_idle"
      ></VTextField>
      <VFileInput
        label="Device's module file"
        v-model="newDeviceStore.module_file"
      ></VFileInput>
      <VBtn
        :loading="!appStore.controller.is_idle"
        :disabled="
          !newDeviceStore.start_init_available || !appStore.controller.is_idle
        "
        @click.stop="
          appStore.controller.start_device_init(
            newDeviceStore.device_name,
            newDeviceStore.module_file[0]
          )
        "
        >Start Init</VBtn
      >
    </VContainer>
  </VForm>

  <!-- Connect -->
  <VForm
    v-bind:disabled="!appStore.controller.is_idle"
    v-show="
      appStore.controller.device_init?.init_state == DeviceInitState.Connect
    "
  >
    <VContainer>
      <p>Connect window</p>
    </VContainer>
  </VForm>
</template>

<style scoped></style>
