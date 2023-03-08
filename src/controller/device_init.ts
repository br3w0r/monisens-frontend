import Api from "../api/api";

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

  async start_device_init(name: string, file: File) {
    // TODO: error handling
    let res = await Api.start_device_init(name, file);

    this._init_state = DeviceInitState.Connect;
    this.id = res.content["application/json"].device_id;

    console.log(res);
  }
}
