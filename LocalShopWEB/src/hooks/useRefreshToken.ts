import { useUser } from "../context/UserContext";
import * as AuthApi from "../network/authApi";

const useRefreshToken = () => {
  const { setAccessToken, setUser } = useUser();
  const refresh = async () => {
    const { user, accessToken } = await AuthApi.refresh();
    setUser(user);
    setAccessToken(accessToken);
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken;
