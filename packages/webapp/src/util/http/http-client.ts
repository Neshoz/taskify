import { AuthenticationError } from "./AuthenticationError";
import { ServerError } from "./ServerError";
import { dispatchUnAuthorizedEvent } from "./util";

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get = <T>(path: string) => {
    return this.invoke<T>("GET", path);
  };

  post = <T>(path: string, body?: unknown) => {
    return this.invoke<T>("POST", path, body);
  };

  put = <T>(path: string, body?: unknown) => {
    return this.invoke<T>("PUT", path, body);
  };

  delete = <T>(path: string) => {
    return this.invoke<T>("DELETE", path);
  };

  private invoke = <T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> => {
    const { abort, signal } = new AbortController();

    const request = new Request(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });

    const promise = fetch(request)
      .then(this.verifyAuthenticated)
      .then(this.verifyResponseOk)
      .then((res) => res.json());

    // @ts-ignore
    promise.cancel = () => {
      abort();
    };

    return promise;
  };

  private verifyAuthenticated = async (response: Response) => {
    if (response.status === 401) {
      dispatchUnAuthorizedEvent();
      return Promise.reject(new AuthenticationError(response));
    }

    return response;
  };

  private verifyResponseOk = (response: Response) => {
    if (!response.ok) {
      return response
        .json()
        .then((detail) => Promise.reject(new ServerError(response, detail)));
    }
    return response;
  };
}
