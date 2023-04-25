import axios, { AxiosError } from "axios";
import { IncomingHttpHeaders } from "http";
import { ClientError } from "../errors";

interface RequestOptionsBase {
  path: string;
  body?: object;
  params?: Record<string, unknown>;
  headers?: IncomingHttpHeaders;
}

interface RequestOptions extends RequestOptionsBase {
  method: string;
}

export class ServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get = async <T>(options: RequestOptionsBase) => {
    const { data } = await this.request<T>({ ...options, method: "GET" });
    return data;
  };
  post = async <T>(options: RequestOptionsBase) => {
    const { data } = await this.request<T>({ ...options, method: "POST" });
    return data;
  };
  put = async <T>(options: RequestOptionsBase) => {
    const { data } = await this.request<T>({ ...options, method: "PUT" });
    return data;
  };
  delete = async <T>(options: RequestOptionsBase) => {
    const { data } = await this.request<T>({ ...options, method: "DELETE" });
    return data;
  };

  private request = async <T>({
    path,
    body,
    params,
    method,
    headers,
  }: RequestOptions) => {
    const url = `${this.baseUrl}${path}`;
    try {
      return await axios<T>({
        method,
        url,
        params,
        data: body,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          cookie: headers?.cookie,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          `Request to ${url} failed with status ${error.response?.status}. Request${error.request} Response: ${error.response?.data}`
        );

        throw new ClientError(
          error.response?.status || -1,
          error.response?.statusText || ""
        );
      } else if (error instanceof Error) {
        console.error(`Request to ${url} failed: ${error.message}`);
        throw new ClientError(500, `Internal server error. ${error.message}`);
      } else {
        console.error(`Request to ${url} failed.`);
        throw new ClientError(500, `Internal server error.`);
      }
    }
  };
}
