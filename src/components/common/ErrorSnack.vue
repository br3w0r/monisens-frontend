<script lang="ts">
export default {
  name: "ErrorSnack",
  props: {
    modelValue: Boolean,
    msgs: Array<String>,
  },
  emits: ["update:modelValue"],
};
</script>

<template>
  <div style="text-align: center">
    <VSnackbar
      :timeout="-1"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event.valueOf())"
      color="red-darken-2"
      :timer="true"
    >
      <template v-slot:actions>
        <VBtn text @click="$emit('update:modelValue', false)">
          Close
        </VBtn>
      </template>

      <ul v-for="(msg, index) in msgs" :key="index">
        <li>{{ msg }}</li>
      </ul>
    </VSnackbar>
  </div>
</template>
