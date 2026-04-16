import { APIRequestContext } from '@playwright/test';

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export abstract class BaseApiClient {
  protected abstract getBaseURL(): string;

  constructor(
    protected request: APIRequestContext,
    private customBaseURL?: string,
  ) {}

  private get baseURL(): string {
    return this.customBaseURL || this.getBaseURL();
  }

  async post<T>(url: string, options: { data?: any; headers?: Record<string, string>; params?: Record<string, string> } = {}): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const response = await this.request.post(fullUrl, {
        data: options.data,
        headers: options.headers,
        params: options.params,
      });

      const responseStatus = response.status();
      const responseData = await response.json();
      const responseHeaders = response.headers();

      const result: ApiResponse<T> = {
        status: responseStatus,
        data: responseData,
        headers: responseHeaders,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  async get<T>(url: string, options: { headers?: Record<string, string>; params?: Record<string, string> } = {}): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    const response = await this.request.get(fullUrl, {
      headers: options.headers,
      params: options.params,
    });

    const responseStatus = response.status();
    const responseData = await response.json();
    const responseHeaders = response.headers();

    const result: ApiResponse<T> = {
      status: responseStatus,
      data: responseData,
      headers: responseHeaders,
    };

    return result;
  }
}
