import { ErrorResponse } from "./api";
import { Configuration } from "./configuration";

export function fetcher<T>(
  config: Configuration,
  route: string,
  method: "GET" | "POST" | "DELETE",
  body: any = null
) {
  return new Promise<T>((resolve, reject) => {
    const url = config.basePath + route;

    fetch(url, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })
      .then((res) =>
        res.json().then((data) => {
          if (res.ok) {
            resolve(data as T);
          } else {
            reject(data as ErrorResponse);
          }
        })
      )
      .catch((error) => {
        reject(error);
      });
  });
}
