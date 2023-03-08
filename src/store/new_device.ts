import { defineStore } from "pinia";

export const useNewDeviceStore = defineStore("new_device", {
  state: () => ({
    device_name: "",
    module_file: new Array<File>(),
  }),
  getters: {
    start_init_available: (state) =>
      state.device_name.length > 0 && state.module_file.length == 1,
  },
});
