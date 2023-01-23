import { defineStore } from "pinia";
import { DevicePanel, Device } from "../controller/device";

export const useAppStore = defineStore("app", {
  state: () => ({
    menu: true,
    about: false,
    device_panel: new DevicePanel([
      new Device("Room condition"),
      new Device("Entrance door"),
    ]),
  }),
  getters: {},
  actions: {
    menu_toggle() {
      this.menu = !this.menu;
    },
    about_open() {
      this.about = true;
    },
    about_close() {
      this.about = false;
    },
  },
});
