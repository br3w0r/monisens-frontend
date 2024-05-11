<script lang="ts">
import { PropType } from "vue";
import { components } from "../../api/contract";
import RangePicker from "./RangePicker.vue";

export default {
  name: "ConfigureSection",
  props: {
    name: String,
    conf_info: Object as PropType<components["schemas"]["ConfInfoEntry"][]>,
    modelValue: Object as PropType<
      Map<number, components["schemas"]["ConfType"]>
    >,
  },
  emits: ["update:modelValue"],
};
</script>

<template>
  <h2 v-if="name">{{ name }}</h2>

  <VContainer v-for="(ci, index) in conf_info" :key="index">
    <VTextField
      v-if="ci.data.String"
      :label="ci.name"
      v-model="modelValue!.get(ci.id)!.String"
    ></VTextField>

    <VTextField
      v-else-if="ci.data.Int"
      :label="ci.name"
      type="number"
      v-model.number="modelValue!.get(ci.id)!.Int"
    ></VTextField>

    <RangePicker
      v-else-if="ci.data.IntRange"
      v-model="modelValue!.get(ci.id)!.IntRange"
      :label="ci.name"
      :step="1"
      :min="ci.data.IntRange.min"
      :max="ci.data.IntRange.max"
    ></RangePicker>

    <VTextField
      v-else-if="ci.data.Float"
      :label="ci.name"
      type="number"
      v-model.number="modelValue!.get(ci.id)!.Float"
    ></VTextField>

    <RangePicker
      v-else-if="ci.data.FloatRange"
      v-model="modelValue!.get(ci.id)!.FloatRange"
      :label="ci.name"
      :step="0.001"
      :min="ci.data.FloatRange.min"
      :max="ci.data.FloatRange.max"
    ></RangePicker>

    <VTextField
      v-if="ci.data.JSON"
      :label="ci.name"
      v-model="modelValue!.get(ci.id)!.JSON"
    ></VTextField>

    <VRadioGroup
      v-else-if="ci.data.ChoiceList"
      v-model.number="modelValue!.get(ci.id)!.ChoiceList"
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
