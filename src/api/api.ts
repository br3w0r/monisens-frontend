import { paths, components } from "./contract";
import { Fetcher } from "openapi-typescript-fetch";
import {
  ApiResponse,
  CustomRequestInit,
  Fetch,
} from "openapi-typescript-fetch/dist/cjs/types";

/** error logging middleware for testing purposes */
async function error_handle_middleware(
  url: string,
  init: CustomRequestInit,
  next: Fetch
): Promise<ApiResponse> {
  const res = await next(url, init).catch((reason) => {
    console.log(init.body);
    console.error(reason);
  });

  if (!res) {
    throw "fetch failed";
  }

  if (!res.ok) {
    console.error("[API] failed to fetch: url: %s; status: %d", url, res.status);
    console.log(init.body);
    console.log(res.data);
  }

  return res;
}

class Api {
  private fetcher = Fetcher.for<paths>();

  constructor() {
    this.fetcher.configure({
      use: [error_handle_middleware],
    });
  }

  async start_device_init(
    name: string,
    file: File
  ): Promise<components["schemas"]["DeviceStartInitResponse"]> {
    const form = new FormData();
    form.append("device_name", name);
    form.append("module_file", file);

    const requestOptions: RequestInit = {
      method: "POST",
      body: form,
    };

    return await fetch("/service/start-device-init", requestOptions).then(
      (resp) => resp.json()
    );
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
}

export default new Api();
