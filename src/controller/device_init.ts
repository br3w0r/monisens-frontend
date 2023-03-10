import Api from "../api/api";
import { components } from "../api/contract";

export enum DeviceInitState {
  None,
  Connect,
  Configure,
  Done,
}

export class DeviceInit {
  private _init_state: DeviceInitState = DeviceInitState.None;
  private id: number = 0;

  get init_state(): DeviceInitState {
    return this._init_state;
  }

  async start_device_init(
    name: string,
    file: File
  ): Promise<components["schemas"]["ConnParamConf"][]> {
    // TODO: error handling
    const res = await Api.start_device_init(name, file);

    this._init_state = DeviceInitState.Connect;
    this.id = res.device_id;

    return res.conn_params;
  }

  async connect_device(connect_conf: components["schemas"]["ConnParam"][]) {
    await Api.connect_device({
      device_id: this.id,
      connect_conf: connect_conf,
    });

    this._init_state = DeviceInitState.Configure;
  }

  async obtain_device_conf_info(): Promise<
    components["schemas"]["DeviceConfInfoEntry"][]
  > {
    return (
      await Api.obtain_device_conf_info({
        device_id: this.id,
      })
    ).data.device_conf_info;
  }

  async configure_device(confs: components["schemas"]["DeviceConfEntry"][]) {
    console.log(confs);

    await Api.configure_device({
      device_id: this.id,
      confs: confs,
    });

    this._init_state = DeviceInitState.Done;
  }
}
