<script lang="ts">
export default {
  name: "NewMonitorPanel",
};
</script>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import LogSettings from "./monitoring_settings/LogSettings.vue";
import LineSettings from "./monitoring_settings/LineSettings.vue";
import Loading from "@/components/common/Loading.vue";

const appStore = useAppStore();
</script>

<template>
  <div style="text-align: center">
    <VDialog v-model="appStore._new_monitor_panel_dialog" persistent>
      <template v-slot:activator>
        <VBtn
          prepend-icon="mdi-plus"
          color="primary"
          @click.stop="appStore.start_add_new_panel"
          class="rounded-pill"
          >Add new panel</VBtn
        >
      </template>

      <VCard>
        <VCardText
          v-if="!appStore._device_sensor_info_loaded"
          style="text-align: center"
        >
          <Loading></Loading>
        </VCardText>

        <VCardText v-else>
          <VRow>
            <VCol cols="10">
              <VSelect
                v-model="appStore.device_sensor_selected"
                item-title="name"
                item-value="name"
                :items="appStore._device_sensor_info"
                return-object
              ></VSelect>

              <!-- Log -->
              <LogSettings
                v-if="appStore.cur_monitor_view_type == 'Log'"
                :device_id="appStore._current_device"
                :sensor_info="appStore.device_sensor_selected"
              ></LogSettings>

              <!-- Line -->
              <LineSettings
                v-else-if="appStore.cur_monitor_view_type == 'Line'"
                :device_id="appStore._current_device"
                :sensor_info="appStore.device_sensor_selected"
              ></LineSettings>
            </VCol>

            <VCol cols="2">
              <div style="text-align: center">
                <h2>View Type</h2>
                <hr />
                <VRadioGroup v-model="appStore.cur_monitor_view_type" mandatory>
                  <VRadio
                    v-for="(
                      view_type, index
                    ) in appStore._monitor_view_type_list"
                    :key="index"
                    :label="view_type.name"
                    :value="view_type.type"
                  ></VRadio>
                </VRadioGroup>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions style="width: 100%; text-align: center">
          <VBtn @click.stop="appStore.close_add_new_panel">Cancel</VBtn>
          <VBtn
            color="primary"
            @click.stop="appStore.save_monitor_conf"
            :loading="appStore._is_saving_new_monitor_conf"
            >Save</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
