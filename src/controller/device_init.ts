import Api from "../api/api";
import { components } from "../api/contract";
import { useNewDeviceStore } from "../store/new_device";

export enum DeviceInitState {
  None,
  Connect,
  Configure,
  Done,
}

export class DeviceInit {
  private store = useNewDeviceStore();

  private _init_state: DeviceInitState = DeviceInitState.None;
  private id: number = 0;
  private _conn_params: components["schemas"]["ConnParamConf"][] | null = null;

  get init_state(): DeviceInitState {
    return this._init_state;
  }

  get conn_params(): components["schemas"]["ConnParamConf"][] | null {
    return this._conn_params;
  }

  async start_device_init(name: string, file: File) {
    // TODO: error handling
    let res = await Api.start_device_init(name, file);

    this._init_state = DeviceInitState.Connect;
    this.id = res.device_id;
    this._conn_params = res.conn_params;

    this._conn_params.forEach((val) => {
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

      this.store.connect_conf.push({
        name: val.name,
        value: value,
      });
    });
  }

  async connect_device() {
    let req: components["schemas"]["ConnectDeviceRequest"] = {
      device_id: this.id,
      connect_conf: this.store.connect_conf,
    };

    await Api.connect_device(req);

    this._init_state = DeviceInitState.Configure;
  }
}
