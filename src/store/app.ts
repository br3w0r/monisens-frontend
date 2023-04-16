import { defineStore } from "pinia";
import Api from "@/api/api";

type Device = {
  id: number;
  name: string;
};

export const useAppStore = defineStore("app", {
  state: () => ({
    is_idle: true,

    menu: true,
    about: false,

    _device_map: new Map<number, Device>(),
    _current_device: -1,
  }),
  getters: {
    current_device: (state) => {
      return state._device_map.get(state._current_device);
    },
    is_busy: (state) => {
      return !state.is_idle;
    },
  },
  actions: {
    // Menu controls
    menu_toggle() {
      this.menu = !this.menu;
    },
    about_open() {
      this.about = true;
    },
    about_close() {
      this.about = false;
    },

    // Device List management
    add_device(id: number, name: string) {
      this._device_map.set(id, {
        id: id,
        name: name,
      });
    },

    set_current_device(id: number) {
      this._current_device = id;
    },

    async init() {
      this.is_idle = false;

      await this.get_device_list();

      this.is_idle = true;
    },

    async get_device_list() {
      const res = await Api.get_device_list({});
      res.data.result.forEach((device) => {
        this.add_device(device.id, device.name);
      });
    },
  },
});
