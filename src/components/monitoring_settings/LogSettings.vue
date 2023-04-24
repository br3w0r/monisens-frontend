<script lang="ts">
import { PropType } from "vue";
import { components } from "@/api/contract";
import Log from "../monitoring/Log.vue";

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
      this.fields = [newInfo.data[0].name];
      this.sort_field = newInfo.data[0].name;
    }
  },
  data() {
    return {
      fields: [this.sensor_info.data[0].name],
      sort_field: this.sensor_info.data[0].name,
      sort_direction: "ASC" as components["schemas"]["SortOrder"],
      sort_direction_list: [
        "ASC",
        "DESC",
      ] as components["schemas"]["SortOrder"][],
      limit: 3,
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
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
</script>

<template>
  <Log
    :device_id="device_id"
    :sensor_name="sensor_info.name"
    :fields="fields"
    :sort_field="sort_field"
    :sort_direction="sort_direction"
    :limit="limit"
  ></Log>

  <br />

  <h3>Fields</h3>
  <VSelect
    label="Fields"
    v-model="fields"
    item-value="name"
    item-title="name"
    :items="sensor_info.data"
    chips
    multiple
  ></VSelect>

  <h3>Limit</h3>
  <VTextField label="Limit" type="number" v-model.number="limit"></VTextField>

  <h3>Sort Field</h3>
  <VSelect
    label="Sort Field"
    v-model="sort_field"
    item-value="name"
    item-title="name"
    :items="sensor_info.data"
    :rules="[validate_limit]"
    chips
  ></VSelect>

  <h3>Sort Direction</h3>
  <VSelect
    label="Sort Direction"
    v-model="sort_direction"
    :items="sort_direction_list"
    chips
  ></VSelect>
</template>
