import { defineStore } from "pinia";
import Api from "@/api/api";
import { components } from "@/api/contract";

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

    // variables for new monitoring panel creation
    _new_monitor_panel_dialog: false,
    _device_sensor_info: [] as components["schemas"]["SensorInfo"][],
    _device_sensor_info_loaded: false,
    device_sensor_selected: {} as components["schemas"]["SensorInfo"],
    _monitor_view_type_list: [
      {
        name: "Log",
        type: "Log" as components["schemas"]["MonitorType"],
      },
      {
        name: "Line",
        type: "Line" as components["schemas"]["MonitorType"],
      },
    ],
    cur_monitor_view_type: "Log" as components["schemas"]["MonitorType"],
    cur_monitor_config: {} as components["schemas"]["MonitorTypeConf"],
    _is_saving_new_monitor_conf: false,

    // variables for mointoring panels
    _cur_monitoring_confs:
      [] as components["schemas"]["MonitorConfListEntry"][],
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

    async set_current_device(id: number) {
      this._current_device = id;

      const res = await Api.get_monitor_conf_list({
        filter: {
          device_id: id,
        },
      });

      this._cur_monitoring_confs = res.data.result;
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
      this._new_monitor_panel_dialog = true;

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

    close_add_new_panel() {
      this._new_monitor_panel_dialog = false;
    },

    async save_monitor_conf() {
      this._is_saving_new_monitor_conf = true;

      const res = await Api.save_monitor_conf({
        device_id: this._current_device,
        sensor: this.device_sensor_selected.name,
        typ: this.cur_monitor_view_type,
        config: this.cur_monitor_config,
      });

      this._cur_monitoring_confs.push({
        id: res.data.id,
        config: this.cur_monitor_config,
        device_id: this._current_device,
        sensor: this.device_sensor_selected.name,
        typ: this.cur_monitor_view_type,
      });

      this.close_add_new_panel();
      this._is_saving_new_monitor_conf = false;
    },
  },
});
