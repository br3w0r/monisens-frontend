import { paths, components } from "./contract";
import { Fetcher } from "openapi-typescript-fetch";
import {
  ApiResponse,
  CustomRequestInit,
  Fetch,
} from "openapi-typescript-fetch/dist/cjs/types";

const BASE_URL =
  import.meta.env.MODE == "development" ? "http://127.0.0.1:8888" : "";

class Api {
  private fetcher = Fetcher.for<paths>();

  constructor() {
    this.fetcher.configure({
      baseUrl: BASE_URL,
    });
  }

  async start_device_init(
    name: string,
    file: File
  ): Promise<
    [
      (
        | components["schemas"]["DeviceStartInitResponse"]
        | components["schemas"]["WebError"]
      ),
      boolean
    ]
  > {
    const form = new FormData();
    form.append("device_name", name);
    form.append("module_file", file);

    const requestOptions: RequestInit = {
      method: "POST",
      body: form,
    };

    let resp = await fetch(
      BASE_URL + "/service/start-device-init",
      requestOptions
    );
    let data = await resp.json();

    return [data, resp.ok];
  }

  public readonly connect_device = this.fetcher
    .path("/service/connect-device")
    .method("post")
    .create();

  public readonly obtain_device_conf_info = this.fetcher
    .path("/service/obtain-device-conf-info")
    .method("post")
    .create();

  public readonly configure_device = this.fetcher
    .path("/service/configure-device")
    .method("post")
    .create();

  public readonly get_device_list = this.fetcher
    .path("/service/get-device-list")
    .method("get")
    .create();

  public readonly get_device_sensor_info = this.fetcher
    .path("/service/get-device-sensor-info")
    .method("post")
    .create();

  public readonly get_sensor_data = this.fetcher
    .path("/service/get-sensor-data")
    .method("post")
    .create();

  public readonly save_monitor_conf = this.fetcher
    .path("/service/save-monitor-conf")
    .method("post")
    .create();

  public readonly get_monitor_conf_list = this.fetcher
    .path("/service/get-monitor-conf-list")
    .method("post")
    .create();
}

export default new Api();
