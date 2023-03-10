<script lang="ts">
import { PropType } from "vue";
import { components } from "../../api/contract";

export default {
  name: "ConfigureSection",
  props: {
    name: String,
    conf_info: Object as PropType<
      components["schemas"]["DeviceConfInfoEntry"][]
    >,
  },
};
</script>

<script setup lang="ts">
import { useNewDeviceStore } from "../../store/new_device";

const newDeviceStore = useNewDeviceStore();
</script>

<template>
  <h2 v-if="name">{{ name }}</h2>

  <VContainer v-for="(ci, index) in conf_info" :key="index">
    <VTextField
      v-if="ci.data.String"
      :label="ci.name"
      v-model="newDeviceStore.conf_by_id(ci.id).String"
    ></VTextField>

    <VTextField
      v-else-if="ci.data.Int"
      :label="ci.name"
      type="number"
      v-model.number="newDeviceStore.conf_by_id(ci.id).Int"
    ></VTextField>

    <VRadioGroup
      v-else-if="ci.data.ChoiceList"
      v-model.number="newDeviceStore.conf_by_id(ci.id).ChoiceList"
    >
      <p>{{ ci.name }}</p>
      <VRadio
        v-for="(choice, index) in ci.data.ChoiceList.choices"
        :key="index"
        :label="choice"
        :value="index"
      ></VRadio>
    </VRadioGroup>

    <ConfigureSection
      v-else-if="ci.data.Section"
      :conf_info="ci.data.Section"
      :name="ci.name"
    ></ConfigureSection>
  </VContainer>
</template>
