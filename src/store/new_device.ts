import { defineStore } from "pinia";
import Api from "@/api/api";
import { components } from "@/api/contract";
import { useAppStore } from "./app";
import { ApiError } from "openapi-typescript-fetch";

export enum DeviceInitState {
  None,
  Connect,
  Configure,
  Done,
}

export const useNewDeviceStore = defineStore("new_device", {
  state: () => ({
    // Errors
    error_msgs: new Array<string>(),
    show_error: false,
    show_error_timeout: null as NodeJS.Timeout | null,
    err_clr_timeout: null as NodeJS.Timeout | null,

    device_id: 0,
    init_state: DeviceInitState.None,
    is_idle: true,
    device_name: "",
    module_file: new Array<File>(),
    conn_conf_info: new Array<components["schemas"]["ConfInfoEntry"]>(),
    conn_conf: new Map<number, components["schemas"]["ConfType"]>(),
    device_conf_info: new Array<components["schemas"]["ConfInfoEntry"]>(),
    device_conf: new Map<number, components["schemas"]["ConfType"]>(),
  }),
  getters: {
    start_init_available: (state) =>
      state.device_name.length > 0 && state.module_file.length == 1,
  },
  actions: {
    handle_error(err_res: components["schemas"]["WebError"]) {
      this.handle_error_raw("[" + err_res.code + "] " + err_res.msg);
    },
    handle_error_raw(err: string) {
      if (this.show_error_timeout) {
        clearTimeout(this.show_error_timeout);
      }

      if (this.err_clr_timeout) {
        clearTimeout(this.err_clr_timeout);
      }

      this.error_msgs.push(err);
      this.show_error = true;

      this.show_error_timeout = setTimeout(() => {
        this.handle_error_close(false);
      }, 5000);
    },
    handle_error_close(show_error: boolean) {
      if (show_error) {
        return;
      }

      this.show_error = false;
      this.err_clr_timeout = setTimeout(() => {
        this.error_msgs = [];
      }, 1000);
    },
    async with_error_handling(func: () => Promise<void>) {
      try {
        await func();
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.data.msg && err.data.code) {
            this.handle_error(err.data);
          } else {
            this.handle_error_raw(
              "[" + err.status + "] " + err.data.toString()
            );
          }
        } else {
          this.handle_error_raw("[unknown] " + err?.toString());
        }
      }
    },

    /** `assign_conf` prepares an `into` container for configuration */
    assign_conf(
      into: Map<number, components["schemas"]["ConfType"]>,
      value: components["schemas"]["ConfInfoEntry"][]
    ) {
      value.forEach((val) => {
        if (val.id == 0 && val.data.Section) {
          this.assign_conf(into, val.data.Section);
          return;
        }

        let conf: components["schemas"]["ConfType"] = (() => {
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
                val.data.IntRange.def_from != undefined
                  ? val.data.IntRange.def_from
                  : val.data.IntRange.min,
                val.data.IntRange.def_to
                  ? val.data.IntRange.def_to
                  : val.data.IntRange.max,
              ],
            };
          } else if (val.data.Float) {
            return {
              Float: val.data.Float.default ? val.data.Float.default : 0.0,
            };
          } else if (val.data.FloatRange) {
            return {
              FloatRange: [
                val.data.FloatRange.def_from != undefined
                  ? val.data.FloatRange.def_from
                  : val.data.FloatRange.min,
                val.data.FloatRange.def_to
                  ? val.data.FloatRange.def_to
                  : val.data.FloatRange.max,
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

        into.set(val.id, conf);
      });
    },

    conf_array_from_map(
      val: Map<number, components["schemas"]["ConfType"]>
    ): components["schemas"]["ConfEntry"][] {
      let confs = new Array<components["schemas"]["ConfEntry"]>();
      for (const [id, conf] of val) {
        confs.push({
          id: id,
          data: conf,
        });
      }

      return confs;
    },

    async start_device_init() {
      this.is_idle = false;

      try {
        const [res, ok] = await Api.start_device_init(
          this.device_name,
          this.module_file[0]
        );
        if (!ok) {
          this.handle_error(res as components["schemas"]["WebError"]);
        } else {
          let success_res =
            res as components["schemas"]["DeviceStartInitResponse"];
          this.device_id = success_res.device_id;
          this.conn_conf_info = success_res.conn_params;
          this.assign_conf(this.conn_conf, success_res.conn_params);

          this.init_state = DeviceInitState.Connect;
        }
      } catch (err) {
        this.handle_error_raw(err!.toString());
      }

      this.is_idle = true;
    },

    async connect_device() {
      this.is_idle = false;

      await this.with_error_handling(async () => {
        let confs = this.conf_array_from_map(this.conn_conf);

        await Api.connect_device({
          device_id: this.device_id,
          connect_conf: confs,
        });

        const res = await Api.obtain_device_conf_info({
          device_id: this.device_id,
        });
        this.device_conf_info = res.data.device_conf_info;

        this.assign_conf(this.device_conf, this.device_conf_info);

        this.init_state = DeviceInitState.Configure;
      });

      this.is_idle = true;
    },

    async configure_device() {
      this.is_idle = false;

      await this.with_error_handling(async () => {
        let confs = this.conf_array_from_map(this.device_conf);

        await Api.configure_device({
          device_id: this.device_id,
          confs: confs,
        });

        this.init_state = DeviceInitState.Done;

        const appStore = useAppStore();
        appStore.add_device(this.device_id, this.device_name);
      });

      this.is_idle = true;
    },
  },
});
