import { defineStore } from "pinia";
import Api from "@/api/api";
import { components } from "@/api/contract";

export enum DeviceInitState {
  None,
  Connect,
  Configure,
  Done,
}

export const useNewDeviceStore = defineStore("new_device", {
  state: () => ({
    device_id: 0,
    init_state: DeviceInitState.None,
    is_idle: true,
    device_name: "",
    module_file: new Array<File>(),
    conn_params: new Array<components["schemas"]["ConnParamConf"]>(),
    connect_conf: new Array<components["schemas"]["ConnParam"]>(),
    conf_info: new Array<components["schemas"]["DeviceConfInfoEntry"]>(),
    confs: new Map<number, components["schemas"]["DeviceConfType"]>(),
  }),
  getters: {
    start_init_available: (state) =>
      state.device_name.length > 0 && state.module_file.length == 1,
  },
  actions: {
    conf_by_id(id: number): components["schemas"]["DeviceConfType"] {
      const res = this.confs.get(id);
      if (res) {
        return res;
      }
      console.error("[conf_by_id]: config with id %d was not found", id);
      return {} as components["schemas"]["DeviceConfType"];
    },

    /** `assign_conf` prepares a container for device configuration */
    assign_conf(value: components["schemas"]["DeviceConfInfoEntry"][]) {
      value.forEach((val) => {
        if (val.id == 0 && val.data.Section) {
          this.assign_conf(val.data.Section);
          return;
        }

        const conf: components["schemas"]["DeviceConfType"] = (() => {
          if (val.data.String) {
            return {
              String: val.data.String.default ? val.data.String.default : "",
            };
          } else if (val.data.Int) {
            return {
              Int: val.data.Int.default ? val.data.Int.default : 0,
            };
          } else if (val.data.IntRange) {
            return {
              IntRange: [
                val.data.IntRange.def_from ? val.data.IntRange.def_from : 0,
                val.data.IntRange.def_to ? val.data.IntRange.def_to : 10,
              ],
            };
          } else if (val.data.Float) {
            return {
              Float: val.data.Float.default ? val.data.Float.default : 0.0,
            };
          } else if (val.data.FloatRange) {
            return {
              FloatRange: [
                val.data.FloatRange.def_from
                  ? val.data.FloatRange.def_from
                  : 0.0,
                val.data.FloatRange.def_to ? val.data.FloatRange.def_to : 10.0,
              ],
            };
          } else if (val.data.JSON) {
            return {
              JSON: val.data.JSON.default ? val.data.JSON.default : "",
            };
          } else if (val.data.ChoiceList) {
            return {
              ChoiceList: val.data.ChoiceList.default
                ? val.data.ChoiceList.default
                : 0,
            };
          } else {
            return {
              String: "INVALID_TYPE",
            };
          }
        })();

        this.confs.set(val.id, conf);
      });
    },

    async start_device_init() {
      this.is_idle = false;

      const res = await Api.start_device_init(
        this.device_name,
        this.module_file[0]
      );
      this.device_id = res.device_id;
      this.conn_params = res.conn_params;

      // Prepare a container for connection configuration
      this.conn_params.forEach((val) => {
        let value: components["schemas"]["ConnParamValType"] = (() => {
          switch (val.typ) {
            case "Bool":
              return {
                Bool: false,
              };
            case "Int":
              return {
                Int: 0,
              };
            case "Float":
              return {
                Float: 0.0,
              };
            case "String":
              return {
                String: "text",
              };
          }
        })();

        this.connect_conf.push({
          name: val.name,
          value: value,
        });
      });

      this.init_state = DeviceInitState.Connect;
      this.is_idle = true;
    },

    async connect_device() {
      this.is_idle = false;

      await Api.connect_device({
        device_id: this.device_id,
        connect_conf: this.connect_conf,
      });

      const res = await Api.obtain_device_conf_info({
        device_id: this.device_id,
      });
      this.conf_info = res.data.device_conf_info;

      this.assign_conf(this.conf_info);

      this.init_state = DeviceInitState.Configure;
      this.is_idle = true;
    },

    async configure_device() {
      this.is_idle = false;

      let confs = new Array<components["schemas"]["DeviceConfEntry"]>();
      for (const [id, conf] of this.confs) {
        confs.push({
          id: id,
          data: conf,
        });
      }

      await Api.configure_device({
        device_id: this.device_id,
        confs: confs,
      });

      this.init_state = DeviceInitState.Done;
      this.is_idle = true;
    },
  },
});
