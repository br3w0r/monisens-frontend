<script setup lang="ts">
import { useAppStore } from "@/store/app";
import NewMonitorPanel from "@/components/NewMonitorPanel.vue";
import Log from "@/components/monitoring/Log.vue";

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

const appStore = useAppStore();
const chartData = {
  labels: ["January", "February", "March"],
  datasets: [
    {
      data: [40, 20, 12],
      borderColor: "#0356fc",
    },
  ],
};
</script>

<template>
  <!-- TODO -->
  <!-- <Line :data="chartData" /> -->

  <NewMonitorPanel></NewMonitorPanel>

  <div
    v-for="(monitor_conf, index) in appStore._cur_monitoring_confs"
    key="index"
  >
    <br />

    <div class="text-subtitle-1" style="text-align: right">
      <span class="font-weight-bold">Sensor: </span>
      {{ monitor_conf.sensor }}
    </div>
    <Log
      v-if="monitor_conf.typ == 'Log'"
      :device_id="monitor_conf.device_id"
      :sensor_name="monitor_conf.sensor"
      :fields="monitor_conf.config.Log!.fields"
      :sort_field="monitor_conf.config.Log!.sort_field"
      :sort_direction="monitor_conf.config.Log!.sort_direction"
      :limit="monitor_conf.config.Log!.limit"
    ></Log>
  </div>
</template>
