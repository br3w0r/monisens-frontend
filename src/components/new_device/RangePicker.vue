<script lang="ts">
export default {
  name: "RangePicker",
  props: {
    step: Number,
    min: Number,
    max: Number,
    modelValue: null,
    label: String,
  },
  computed: {
    inputVal: {
      get() {
        return this.modelValue;
      },
      set(val: any) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  emits: ["update:modelValue"],
};
</script>

<template>
  <h3 v-if="label" style="padding-bottom: 20px;">{{ label }}</h3>

  <VRangeSlider v-model="inputVal" :min="min" :max="max" :step="step">
    <template v-slot:prepend>
      <v-text-field
        v-model="inputVal![0]"
        hide-details
        single-line
        type="number"
        variant="outlined"
        density="compact"
        style="width: 120px"
      ></v-text-field>
    </template>
    <template v-slot:append>
      <v-text-field
        v-model="inputVal![1]"
        hide-details
        single-line
        type="number"
        variant="outlined"
        density="compact"
        style="width: 120px"
      ></v-text-field>
    </template>
  </VRangeSlider>
</template>
