export class Device {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Controller {
  // Device vars
  private _current_device: number = -1;
  private _device_list: Device[];

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
}
