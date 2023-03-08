<script setup lang="ts">
import { RouterView } from "vue-router";
import { Fetcher } from "openapi-typescript-fetch";

import { useAppStore } from "./store/app";
import { paths } from "./api/contract";

const appStore = useAppStore();

// const fetcher = Fetcher.for<paths>();

// const url = "/service/obtain-device-conf-info";
// const response = await fetcher.path(url).method("post").create()({
//   device_id: 666,
// });

// console.log(response);
</script>

<template>
  <VApp>
    <VAppBar app elevation="1">
      <VAppBarNavIcon @click.stop="appStore.menu_toggle"></VAppBarNavIcon>
      <VTabs>
        <VTab to="/" prepend-icon="mdi-chart-box-outline">Monitoring</VTab>
        <VTab to="/new-device" prepend-icon="mdi-plus">Add new device</VTab>
      </VTabs>

      <template v-slot:append>
        <VBtn
          prepend-icon="mdi-help-circle-outline"
          @click.stop="appStore.about_open"
        >
          About
        </VBtn>
      </template>
    </VAppBar>

    <VFadeTransition>
      <VContainer
        fill-height
        fluid
        v-show="appStore.about"
        style="
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          position: absolute;
          z-index: 100000;
        "
      >
        <VRow align="center" justify="center" style="height: 100%">
          <VCol>
            <VCard
              max-width="500px"
              style="margin: auto"
              elevation="12"
              title="About"
            >
              <template v-slot:append>
                <VBtn
                  icon="mdi-close"
                  flat
                  @click.stop="appStore.about_close"
                ></VBtn>
              </template>

              <VCardText>
                <h1>MoniSens</h1>
                <br />
                <p>
                  Modern SCADA system with focus on speed, stability and
                  usability.
                </p>
              </VCardText>

              <VCardActions>
                <div style="margin: auto">
                  <VBtn
                    icon="mdi-github"
                    href="https://github.com/br3w0r/"
                    target="_blank"
                  ></VBtn>
                  <VBtn
                    icon="mdi-reddit"
                    href="https://www.reddit.com/r/ProgrammerHumor/"
                    target="_blank"
                  ></VBtn>
                </div>
              </VCardActions>
              <p class="font-weight-thin" style="padding: 10px">
                v0.0.1, Daniil Dirun © 2023
              </p>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VFadeTransition>

    <VNavigationDrawer v-model="appStore.menu">
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
          v-for="(device, index) in appStore.controller.device_list"
          :key="index"
          :title="device.name"
          :to="'/device/' + index"
          @click.stop="appStore.controller.device(index)"
        />
      </VList>
    </VNavigationDrawer>

    <VMain>
      <RouterView></RouterView>
    </VMain>
  </VApp>
</template>

<style>
.v-main {
  margin: 20px;
}
</style>
