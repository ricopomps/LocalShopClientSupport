import axios, { AxiosInstance } from "axios";

class ApiService {
  private api: AxiosInstance;
  private accessToken: string | null;
  private requestInterceptor: number;
  private responseInterceptor: number;
  private setContextAccessToken: ((accessToken: string) => void) | null;

  constructor(baseUrl?: string) {
    this.api = axios.create({
      withCredentials: true,
      baseURL: baseUrl,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    this.accessToken = null;
    this.requestInterceptor = 0;
    this.responseInterceptor = 0;
    this.setContextAccessToken = null;
  }

  setAccessToken(
    token: string,
    setContextAccessToken?: (accessToken: string) => void
  ) {
    if (!this.setContextAccessToken && setContextAccessToken)
      this.setContextAccessToken = setContextAccessToken;

    this.removeInterceptors();
    this.accessToken = token;
    this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    this.applyInterceptors(this.accessToken);
  }

  clearAccessToken() {
    this.accessToken = null;
    delete this.api.defaults.headers.common.Authorization;
  }

  getApi(token?: string) {
    if (token) this.setAccessToken(token);
    return this.api;
  }

  private applyInterceptors(accessToken: string) {
    const requestIntercept = this.api.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const {
            data: { accessToken: newAccessToken },
          } = await this.api.get(`/api/auth/refresh`);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          if (this.setContextAccessToken)
            this.setContextAccessToken(newAccessToken);
          return this.api(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    this.requestInterceptor = requestIntercept;
    this.responseInterceptor = responseIntercept;
  }

  removeInterceptors() {
    this.api.interceptors.request.eject(this.requestInterceptor);
    this.api.interceptors.response.eject(this.responseInterceptor);
  }
}

export default ApiService;
