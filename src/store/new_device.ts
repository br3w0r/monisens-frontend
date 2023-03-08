import { defineStore } from "pinia";
import { components } from "../api/contract";

export const useNewDeviceStore = defineStore("new_device", {
  state: () => ({
    device_name: "",
    module_file: new Array<File>(),
    connect_conf: new Array<components["schemas"]["ConnParam"]>(),
  }),
  getters: {
    start_init_available: (state) =>
      state.device_name.length > 0 && state.module_file.length == 1,
  },
});
