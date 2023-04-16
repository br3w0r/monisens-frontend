<script lang="ts">
export default {
  name: "DeviceList",
};
</script>

<script setup lang="ts">
import { useAppStore } from "@/store/app";

const appStore = useAppStore();
</script>

<template>
  <VList>
    <VListItem
      link
      prepend-icon="mdi-star"
      title="Favourites"
      to="/favourites"
    />
    <VListItem
      link
      prepend-icon="mdi-circle"
      v-for="[id, device] in appStore._device_map"
      :key="id"
      :title="device.name"
      :to="'/device/' + id"
      @click.stop="appStore.set_current_device(id)"
    />
  </VList>
</template>

<style>
.v-main {
  margin: 20px;
}
</style>
