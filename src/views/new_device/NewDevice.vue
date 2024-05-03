<script setup lang="ts">
import { useNewDeviceStore } from "@/store/new_device";
import { DeviceInitState } from "@/store/new_device";
import Connect from "./Connect.vue";
import Configure from "./Configure.vue";
import ErrorSnack from "@/components/common/ErrorSnack.vue";

const newDeviceStore = useNewDeviceStore();
</script>

<template>
  <!-- Error Snackbar -->
  <ErrorSnack
    :modelValue="newDeviceStore.show_error"
    @update:modelValue="newDeviceStore.handle_error_close($event.valueOf())"
    :msgs="newDeviceStore.error_msgs"></ErrorSnack>
  
  <!-- Start init -->
  <VForm
    v-bind:disabled="!newDeviceStore.is_idle"
    v-show="newDeviceStore.init_state == DeviceInitState.None"
  >
    <VContainer>
      <h1>1. Start initialization</h1>
      <VTextField
        label="Device name"
        v-model="newDeviceStore.device_name"
        :active="newDeviceStore.is_idle"
      ></VTextField>
      <VFileInput
        label="Device's module file"
        v-model="newDeviceStore.module_file"
      ></VFileInput>
      <VBtn
        :loading="!newDeviceStore.is_idle"
        :disabled="
          !newDeviceStore.start_init_available || !newDeviceStore.is_idle
        "
        @click.stop="newDeviceStore.start_device_init()"
        >Start Init</VBtn
      >
    </VContainer>
  </VForm>

  <!-- Connect -->
  <Connect
    v-show="newDeviceStore.init_state == DeviceInitState.Connect"
  ></Connect>

  <!-- Configure -->
  <Configure
    v-show="newDeviceStore.init_state == DeviceInitState.Configure"
  ></Configure>

  <!-- Done -->
  <h1 v-show="newDeviceStore.init_state == DeviceInitState.Done">
    You're all set!
  </h1>
</template>

<style scoped></style>
