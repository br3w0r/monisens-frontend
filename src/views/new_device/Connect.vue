<script setup lang="ts">
import { useNewDeviceStore } from "@/store/new_device";

const newDeviceStore = useNewDeviceStore();
</script>

<template>
  <VForm v-bind:disabled="!newDeviceStore.is_idle">
    <VContainer>
      <h1>2. Connect to the device</h1>
      <div
        v-for="(conn_param, index) in newDeviceStore.conn_params"
        :key="index"
      >
        <!-- Bool -->
        <VCheckbox
          v-if="conn_param.typ == 'Bool'"
          :label="conn_param.name"
          v-model="newDeviceStore.connect_conf[index].value.Bool"
        ></VCheckbox>

        <!-- Int -->
        <VTextField
          v-else-if="conn_param.typ == 'Int'"
          :label="conn_param.name"
          type="number"
          v-model.number="newDeviceStore.connect_conf[index].value.Int"
        ></VTextField>

        <!-- Float -->
        <VTextField
          v-else-if="conn_param.typ == 'Float'"
          :label="conn_param.name"
          type="number"
          v-model.number="newDeviceStore.connect_conf[index].value.Float"
        ></VTextField>

        <!-- String -->
        <VTextField
          v-else-if="conn_param.typ == 'String'"
          :label="conn_param.name"
          v-model="newDeviceStore.connect_conf[index].value.String"
        ></VTextField>
      </div>

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
