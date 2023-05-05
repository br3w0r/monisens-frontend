<script lang="ts">
import { PropType } from "vue";
import { components } from "@/api/contract";
import Api from "@/api/api";

const UPDATE_TIMEOUT = 500;

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
        this.log_data = [];
        this.update_with_timeout();
      },
      deep: true,
    },
    sensor_name() {
      this.log_data = [];
      this.conf.sync_interval.selected = this.conf.sync_interval.default;
      this.conf.show_loading = true;
    },
    "conf.sync_interval.selected"(newVal) {
      this.set_sync_interval(newVal);
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
      conf: {
        sync_interval: {
          selected: 5000,
          default: 5000,
          variants: [
            {
              name: "0.5s",
              value: 500,
            },
            {
              name: "1s",
              value: 1000,
            },
            {
              name: "3s",
              value: 3000,
            },
            {
              name: "5s",
              value: 5000,
            },
            {
              name: "10s",
              value: 10000,
            },
            {
              name: "1m",
              value: 60000,
            },
            {
              name: "5m",
              value: 300000,
            },
            {
              name: "10m",
              value: 600000,
            },
          ],
        },
        show_loading: true,
      },
    };
  },
  methods: {
    init() {
      this.update();
      this.set_sync_interval(this.conf.sync_interval.selected);
    },

    update_with_timeout() {
      if (this.update_timeout) {
        clearTimeout(this.update_timeout);
      }

      this.update_timeout = setTimeout(this.update, UPDATE_TIMEOUT);
    },

    set_sync_interval(sync_interval: number) {
      if (this.sync_interval) {
        clearInterval(this.sync_interval);
      }
      this.sync_interval = setInterval(this.update, sync_interval);
    },

    update() {
      this.ready = false;

      let req: components["schemas"]["GetSensorDataRequest"] = {
        device_id: this.device_id,
        fields: this.fields,
        sensor: this.sensor_name,
        sort: {
          field: this.sort_field,
          order: this.sort_direction,
        },
        limit: this.limit,
      };

      if (this.log_data.length > 0) {
        req.from = this.log_data[0][this.sort_field];
      }

      Api.get_sensor_data(req).then((res) => {
        if (this.log_data.length > 0) {
          if (res.data.result.length > 0) {
            let array_len = this.log_data.length + res.data.result.length;
            if (array_len > this.limit) {
              array_len = this.limit;
            }

            let i = 0;
            let new_log_data = Array<(typeof res.data.result)[0]>(array_len);

            for (; i < res.data.result.length; i++) {
              new_log_data[i] = res.data.result[i];
            }

            for (let j = 0; j < this.log_data.length; j++) {
              if (i + j >= this.limit) {
                break;
              }

              new_log_data[i + j] = this.log_data[j];
            }

            this.log_data = new_log_data;
          }
        } else {
          this.log_data = res.data.result;
        }
        this.ready = true;
      });
    },
  },
  async mounted() {
    await this.init();
    this.ready = true;
  },
  unmounted() {
    // Clear intervals and timeouts on unload
    if (this.sync_interval) {
      clearInterval(this.sync_interval);
    }

    if (this.update_timeout) {
      clearTimeout(this.update_timeout);
    }
  },
};
</script>

<script setup lang="ts">
import Loading from "../common/Loading.vue";
</script>

<template>
  <VCard>
    <VRow style="height: 50px">
      <VCol>
        <VSelect
          density="compact"
          label="Update interval"
          v-model="conf.sync_interval.selected"
          item-title="name"
          :items="conf.sync_interval.variants"
        ></VSelect>
      </VCol>
      <VCol>
        <VCheckbox
          label="Show loading screen"
          v-model="conf.show_loading"
        ></VCheckbox>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VTable height="400px" v-if="ready || !conf.show_loading" fixed-header>
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

        <Loading style="height: 400px" v-else-if="conf.show_loading"></Loading>
      </VCol>
    </VRow>
  </VCard>
</template>
