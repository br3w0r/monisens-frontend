import { DeviceInit } from "./device_init";
import { components } from "../api/contract";

export enum PendingStatus {
  None,
  Pending,
}

export class Device {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Controller {
  private _pending_status = PendingStatus.None;

  private _device_init = new DeviceInit();

  // Device vars
  private _current_device: number = -1;
  private _device_list: Device[];

  get is_idle(): boolean {
    return this._pending_status == PendingStatus.None;
  }

  get device_init(): DeviceInit {
    return this._device_init;
  }

  get current_device(): number {
    return this._current_device;
  }

  get device_list(): Device[] {
    return this._device_list;
  }

  get cur_device(): Device | null {
    if (this._current_device < 0) {
      return null;
    }

    return this._device_list[this._current_device];
  }

  constructor(device_list: Device[] | null) {
    this._device_list = device_list != null ? device_list : [];
  }

  device(id: number): Device | null {
    if (id > this._device_list.length - 1) {
      return null;
    }

    this._current_device = id;

    return this._device_list[id];
  }

  add_device(device: Device) {
    this._device_list.push(device);
  }

  async start_device_init(
    name: string,
    file: File
  ): Promise<components["schemas"]["ConnParamConf"][]> {
    this._pending_status = PendingStatus.Pending;
    this._device_init = new DeviceInit();
    const conn_params = await this._device_init.start_device_init(name, file);
    this._pending_status = PendingStatus.None;

    return conn_params;
  }

  async connect_device(connect_conf: components["schemas"]["ConnParam"][]) {
    this._pending_status = PendingStatus.Pending;
    await this._device_init?.connect_device(connect_conf);
    this._pending_status = PendingStatus.None;
  }

  async obtain_device_conf_info(): Promise<
    components["schemas"]["DeviceConfInfoEntry"][]
  > {
    this._pending_status = PendingStatus.Pending;
    const res = await this._device_init.obtain_device_conf_info();
    this._pending_status = PendingStatus.None;

    return res;
  }

  async configure_device(confs: components["schemas"]["DeviceConfEntry"][]) {
    this._pending_status = PendingStatus.Pending;
    await this._device_init.configure_device(confs);
    this._pending_status = PendingStatus.None;
  }
}
