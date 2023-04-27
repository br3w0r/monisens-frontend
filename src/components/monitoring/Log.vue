<script lang="ts">
import { PropType } from "vue";
import { components } from "@/api/contract";
import Api from "@/api/api";

const UPDATE_TIMEOUT = 500;
const SYNC_INTERVAL = 5000;

export default {
  name: "Log",
  props: {
    device_id: {
      type: Number,
      required: true,
    },
    sensor_name: {
      type: String,
      required: true,
    },
    fields: {
      type: Array as PropType<string[]>,
      required: true,
    },
    sort_field: {
      type: String,
      required: true,
    },
    sort_direction: {
      type: String as PropType<components["schemas"]["SortOrder"]>,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
  watch: {
    $props: {
      handler() {
        this.init();
      },
      deep: true,
    },
    sensor_info() {
      this.log_data = [];
    },
  },
  data() {
    return {
      ready: false,
      log_data: {} as {
        [key: string]: components["schemas"]["SensorData"] | undefined;
      }[],
      update_timeout: undefined as ReturnType<typeof setTimeout> | undefined,
      sync_interval: undefined as ReturnType<typeof setInterval> | undefined,
    };
  },
  methods: {
    init() {
      if (this.update_timeout) {
        clearTimeout(this.update_timeout);
      }

      if (this.sync_interval) {
        clearInterval(this.sync_interval);
      }

      this.update_timeout = setTimeout(this.update, UPDATE_TIMEOUT);
      this.sync_interval = setInterval(this.update, SYNC_INTERVAL);
    },

    update() {
      this.ready = false;
      Api.get_sensor_data({
        device_id: this.device_id,
        fields: this.fields,
        sensor: this.sensor_name,
        sort: {
          field: this.sort_field,
          order: this.sort_direction,
        },
        limit: this.limit,
      }).then((res) => {
        this.log_data = res.data.result;
        this.ready = true;
      });
    },
  },
  async mounted() {
    await this.init();
    this.ready = true;
  },
};
</script>

<script setup lang="ts">
import Loading from "../common/Loading.vue";
</script>

<template>
  <VCard height="300px">
    <VTable height="300px" v-if="ready" fixed-header>
      <thead>
        <tr>
          <th v-for="(field, index) in fields" :key="index">
            {{ field }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in log_data" :key="index">
          <td v-for="(field, index) in fields" :key="index">
            {{ data[field] ? Object.values(data[field] as Object)[0] : "" }}
          </td>
        </tr>
      </tbody>
    </VTable>

    <Loading v-else></Loading>
  </VCard>
</template>
