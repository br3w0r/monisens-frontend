import { DeviceInit } from "./device_init";

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
  private _pending_status: PendingStatus = PendingStatus.None;

  private _device_init: DeviceInit | null = null;

  // Device vars
  private _current_device: number = -1;
  private _device_list: Device[];

  get is_idle(): boolean {
    return this._pending_status == PendingStatus.None;
  }

  get device_init(): DeviceInit | null {
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

  async start_device_init(name: string, file: File) {
    if (this._device_init != null) {
      // TODO: error if this.device_init != null
    }

    this._pending_status = PendingStatus.Pending;
    this._device_init = new DeviceInit();

    await this._device_init.start_device_init(name, file);

    this._pending_status = PendingStatus.None;
  }
}
