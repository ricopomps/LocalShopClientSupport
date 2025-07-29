import axios from "axios";
import CryptoJS from "crypto-js";

class ApiService {
  private static apiServiceInstance: ApiService;
  private api;
  private accessToken: string | null;
  private requestInterceptor: number;
  private responseInterceptor: number;
  private setContextAccessToken: ((accessToken: string) => void) | null;

  private encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY ?? "secretKey"; // TODO: use a cleanEnv file to correctly type this variable

  constructor() {
    this.api = axios.create({
      withCredentials: true,
      baseURL: process.env.REACT_APP_API_GATEWAY_BASE_URL,
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

  getApi() {
    return this.api;
  }

  private encryptData(data: any) {
    const jsonStr = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      jsonStr,
      this.encryptionKey
    ).toString();
    return { data: encrypted };
  }

  private decryptData(encrypted: string) {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }

  private applyInterceptors(accessToken: string) {
    const requestIntercept = this.api.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const method = config.method?.toUpperCase() ?? "";
        if (
          ["POST", "PUT", "PATCH"].includes(method) &&
          config.data &&
          typeof config.data === "object"
        ) {
          config.data = this.encryptData(config.data);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = this.api.interceptors.response.use(
      (response) => {
        if (
          response?.data &&
          typeof response.data === "object" &&
          typeof response.data.data === "string"
        ) {
          try {
            response.data = this.decryptData(response.data.data);
          } catch (err) {
            console.warn("Decryption failed:", err);
          }
        }
        return response;
      },
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

  static getInstance() {
    if (!this.apiServiceInstance) {
      this.apiServiceInstance = new ApiService();
    }
    return this.apiServiceInstance;
  }
}

export default ApiService;
