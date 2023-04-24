import { defineStore } from "pinia";
import Api from "@/api/api";
import { components } from "@/api/contract";

type Device = {
  id: number;
  name: string;
};

export enum MonitorViewType {
  Log,
}

export const useAppStore = defineStore("app", {
  state: () => ({
    is_idle: true,

    menu: true,
    about: false,

    _device_map: new Map<number, Device>(),
    _current_device: -1,

    // variables for new monitoring panel creation
    _new_device_dialog: false,
    _device_sensor_info: [] as components["schemas"]["SensorInfo"][],
    _device_sensor_info_loaded: false,
    device_sensor_selected: {} as components["schemas"]["SensorInfo"],
    _monitor_view_type_list: [
      {
        name: "Log",
        type: MonitorViewType.Log,
      },
    ],
    cur_monitor_view_type: MonitorViewType.Log,
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

    async start_add_new_panel() {
      this._device_sensor_info_loaded = false;
      this._new_device_dialog = true;

      const res = await Api.get_device_sensor_info({
        device_id: this._current_device,
      });
      this._device_sensor_info = res.data.device_sensor_info;

      if (this._device_sensor_info.length > 0) {
        this.device_sensor_selected = this._device_sensor_info[0];
      } else {
        this.device_sensor_selected.name = "[NO SENSORS]";
      }

      this._device_sensor_info_loaded = true;
    },

    cancel_add_new_panel() {
      this._new_device_dialog = false;
      this._device_sensor_info_loaded = false;
    },
  },
});
