import { defineStore } from "pinia";

class Device {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class DevicePanel {
  private _current: number = -1;
  private _device_list: Device[] = [];

  get current(): number {
    return this._current;
  }

  get device_list(): Device[] {
    return this._device_list;
  }

  get cur_device(): Device | null {
    if (this._current < 0) {
      return null;
    }

    return this._device_list[this._current];
  }

  constructor(device_list: Device[] | null) {
    if (device_list != null) {
      this._device_list = device_list;
    }
  }

  device(id: number): Device | null {
    if (id > this._device_list.length - 1) {
      return null;
    }

    this._current = id;

    return this._device_list[id];
  }

  add_device(device: Device) {
    this._device_list.push(device);
  }
}

export const useAppStore = defineStore("app", {
  state: () => ({
    menu: true,
    about: false,
    device_panel: new DevicePanel([
      new Device("Room condition"),
      new Device("Entrance door"),
    ]),
  }),
  getters: {},
  actions: {
    menu_toggle() {
      this.menu = !this.menu;
    },
    about_open() {
      this.about = true;
    },
    about_close() {
      this.about = false;
    },
  },
});
