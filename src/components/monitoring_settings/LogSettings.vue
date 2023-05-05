<script lang="ts">
import { PropType } from "vue";
import { components } from "@/api/contract";
import { mapStores } from 'pinia'
import { useAppStore } from "@/store/app";

export default {
  name: "LogSettings",
  props: {
    device_id: {
      type: Number,
      required: true,
    },
    sensor_info: {
      type: Object as PropType<components["schemas"]["SensorInfo"]>,
      required: true,
    },
  },
  watch: {
    sensor_info(newInfo) {
      // in case of sensor change
      this.appStore.cur_monitor_config.Log!.fields = [newInfo.data[0].name];
      this.appStore.cur_monitor_config.Log!.sort_field = newInfo.data[0].name;
    },
  },
  computed: {
    ...mapStores(useAppStore),
  },
  data() {
    return {
      sort_direction_list: [
        "ASC",
        "DESC",
      ] as components["schemas"]["SortOrder"][],
    };
  },
  created() {
    this.appStore.cur_monitor_config = {
      Log: {
        fields: [this.sensor_info.data[0].name],
        limit: 3,
        sort_direction: "ASC",
        sort_field: this.sensor_info.data[0].name,
      },
    };
  },
  methods: {
    validate_limit(val: number): boolean {
      if (val < 0) {
        return false;
      } else if (val > 1000) {
        return false;
      }

      return true;
    },
  },
};
</script>

<script setup lang="ts">
import Log from "../monitoring/Log.vue";
</script>

<template>
  <Log
    :device_id="device_id"
    :sensor_name="sensor_info.name"
    :fields="appStore.cur_monitor_config.Log!.fields"
    :sort_field="appStore.cur_monitor_config.Log!.sort_field"
    :sort_direction="appStore.cur_monitor_config.Log!.sort_direction"
    :limit="appStore.cur_monitor_config.Log!.limit"
  ></Log>

  <br />

  <h3>Fields</h3>
  <VSelect
    label="Fields"
    v-model="appStore.cur_monitor_config.Log!.fields"
    item-value="name"
    item-title="name"
    :items="sensor_info.data"
    chips
    multiple
  ></VSelect>

  <h3>Limit</h3>
  <VTextField
    label="Limit"
    type="number"
    v-model.number="appStore.cur_monitor_config.Log!.limit"
  ></VTextField>

  <h3>Sort Field</h3>
  <VSelect
    label="Sort Field"
    v-model="appStore.cur_monitor_config.Log!.sort_field"
    item-value="name"
    item-title="name"
    :items="sensor_info.data"
    :rules="[validate_limit]"
    chips
  ></VSelect>

  <h3>Sort Direction</h3>
  <VSelect
    label="Sort Direction"
    v-model="appStore.cur_monitor_config.Log!.sort_direction"
    :items="sort_direction_list"
    chips
  ></VSelect>
</template>
