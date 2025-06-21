import envConfig from "@/config";
import {
  normalizePath,
  removeTokensFromLocalStorage,
  setSessionTokenToLocalStorage,
} from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.model";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message:
    | string
    | Array<{
        message: string;
        path: string;
      }>;
  error?: string;
  statusCode?: number;
  errors?: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message:
      | string
      | Array<{
          message: string;
          path: string;
        }>;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Lỗi HTTP",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload & {
    errors: {
      field: string;
      message: string;
    }[];
  };
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: any;
  }) {
    // Normalize payload để đảm bảo có errors array
    let normalizedPayload: EntityErrorPayload & {
      errors: {
        field: string;
        message: string;
      }[];
    };

    if (Array.isArray(payload.message)) {
      // Trường hợp server trả về message là array
      normalizedPayload = {
        ...payload,
        errors: payload.message.map((item: any) => ({
          field: item.path || item.field,
          message: item.message,
        })),
      };
    } else if (payload.errors) {
      // Trường hợp server đã có errors array
      normalizedPayload = payload;
    } else {
      // Trường hợp khác, tạo errors array rỗng
      normalizedPayload = {
        ...payload,
        errors: [],
      };
    }

    super({ status, payload: normalizedPayload, message: "Lỗi thực thể" });
    this.status = status;
    this.payload = normalizedPayload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
const isClient = typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null, // Logout mình sẽ cho phép luôn luôn thành công
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            removeTokensFromLocalStorage();
            location.href = "/login";
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (["api/auth/login", "api/guest/auth/login"].includes(normalizeUrl)) {
      const { sessionToken } = (payload as LoginResType).data;
      setSessionTokenToLocalStorage(sessionToken);
    } else if (
      ["api/auth/logout", "api/guest/auth/logout"].includes(normalizeUrl)
    ) {
      removeTokensFromLocalStorage();
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> & {
      params?: Record<string, string | number | boolean>;
    }
  ) {
    let finalUrl = url;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      finalUrl = `${url}?${searchParams.toString()}`;
    }

    const { params, ...restOptions } = options || {};
    return request<Response>("GET", finalUrl, restOptions);
  },
  getList<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> & {
      params?: Record<string, string | number | boolean>;
    }
  ) {
    let finalUrl = url;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      finalUrl = `${url}?${searchParams.toString()}`;
    }

    const { params, ...restOptions } = options || {};
    return request<Response>("GET", finalUrl, restOptions);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
