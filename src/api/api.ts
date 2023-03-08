import { paths } from "./contract";
import { Fetcher } from "openapi-typescript-fetch";

class Api {
  private fetcher = Fetcher.for<paths>();

  async start_device_init(
    name: string,
    file: File
  ): Promise<
    paths["/service/start-device-init"]["post"]["responses"][200 | 500]
  > {
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
}

export default new Api();
