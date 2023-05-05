<script lang="ts">
import { PropType } from "vue";
import { components } from "@/api/contract";
import Api from "@/api/api";

const UPDATE_TIMEOUT = 500;

export default {
  name: "Line",
  props: {
    device_id: {
      type: Number,
      required: true,
    },
    sensor_name: {
      type: String,
      required: true,
    },
    x_field: {
      type: String,
      required: true,
    },
    y_field: {
      type: String,
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
      },
      chart_options: {
        animation: false,
        scales: {
          y: {
            title: {
              display: true,
              text: this.y_field,
            },
          },
          x: {
            title: {
              display: true,
              text: this.x_field,
            },
          },
        },
      },
    };
  },
  computed: {
    chartData() {
      let log_data_reversed: typeof this.log_data = [];
      if (this.log_data.length > 0) {
        log_data_reversed = [...this.log_data].reverse();
      }

      return {
        labels: log_data_reversed.map((val) =>
          val[this.x_field] ? Object.values(val[this.x_field] as Object)[0] : ""
        ),
        datasets: [
          {
            data: log_data_reversed.map((val) =>
              val[this.y_field]
                ? Object.values(val[this.y_field] as Object)[0]
                : ""
            ),
            borderColor: "#0356fc",
            label: this.y_field,
          },
        ],
      };
    },
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
        fields: [this.x_field, this.y_field],
        sensor: this.sensor_name,
        sort: {
          field: this.x_field,
          order: "DESC",
        },
        limit: this.limit,
      };

      if (this.log_data.length > 0) {
        req.from = this.log_data[0][this.x_field];
      }

      Api.get_sensor_data(req).then((res) => {
        if (this.log_data.length > 0) {
          if (res.data.result.length == 0) {
            return;
          }

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
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
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
    </VRow>
    <VRow>
      <VCol>
        <Line
          v-if="ready || log_data.length > 0"
          :data="chartData"
          :options="chart_options"
        ></Line>
        <Loading style="height: 400px" v-else></Loading>
      </VCol>
    </VRow>
  </VCard>
</template>
