import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useUser } from "../context/UserContext";
import ApiService from "../network/api";

const useAxiosPrivate = () => {
  const apiService = ApiService.getInstance();

  const refresh = useRefreshToken();
  const { accessToken } = useUser();

  useEffect(() => {
    const requestIntercept = apiService.getApi().interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = apiService.getApi().interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiService.getApi()(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiService.getApi().interceptors.request.eject(requestIntercept);
      apiService.getApi().interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return apiService.getApi();
};

export default useAxiosPrivate;
