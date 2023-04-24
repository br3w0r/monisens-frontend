<script setup lang="ts">
import { useAppStore } from "@/store/app";
import NewMonitorPanel from "@/components/NewMonitorPanel.vue"

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
</template>
