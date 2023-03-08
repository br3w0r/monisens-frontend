import { defineStore } from "pinia";
import { Controller, Device } from "../controller/controller";

export const useAppStore = defineStore("app", {
  state: () => ({
    menu: true,
    about: false,
    controller: new Controller([
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
