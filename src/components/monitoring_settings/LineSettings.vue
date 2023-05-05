<script lang="ts">
import { PropType } from "vue";
import { components } from "@/api/contract";
import { mapStores } from "pinia";
import { useAppStore } from "@/store/app";

export default {
  name: "LineSettings",
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
      this.appStore.cur_monitor_config.Line!.x_field =
        this.sensor_info.data[0].name;
      this.appStore.cur_monitor_config.Line!.y_field = this.sensor_info.data[1]
        ? this.sensor_info.data[1].name
        : this.sensor_info.data[0].name;
    },
  },
  computed: {
    ...mapStores(useAppStore),
  },
  created() {
    this.appStore.cur_monitor_config = {
      Line: {
        x_field: this.sensor_info.data[0].name,
        y_field: this.sensor_info.data[1]
          ? this.sensor_info.data[1].name
          : this.sensor_info.data[0].name,
        limit: 3,
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
import Line from "../monitoring/Line.vue";
</script>

<template>
  <Line
    :device_id="device_id"
    :sensor_name="sensor_info.name"
    :x_field="appStore.cur_monitor_config.Line!.x_field"
    :y_field="appStore.cur_monitor_config.Line!.y_field"
    :limit="appStore.cur_monitor_config.Line!.limit"
  ></Line>

  <br />

  <h3>X Field</h3>
  <VSelect
    label="X Field"
    v-model="appStore.cur_monitor_config.Line!.x_field"
    item-value="name"
    item-title="name"
    :items="sensor_info.data"
    chips
  ></VSelect>

  <h3>Y Field</h3>
  <VSelect
    label="Y Field"
    v-model="appStore.cur_monitor_config.Line!.y_field"
    item-value="name"
    item-title="name"
    :items="sensor_info.data"
    chips
  ></VSelect>

  <h3>Limit</h3>
  <VTextField
    label="Limit"
    type="number"
    v-model.number="appStore.cur_monitor_config.Line!.limit"
  ></VTextField>
</template>
