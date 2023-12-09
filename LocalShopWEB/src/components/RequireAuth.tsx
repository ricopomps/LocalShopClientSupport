import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import RoutesEnum from "../utils/routesEnum";

const RequireAuth = () => {
  const { user } = useUser();
  const location = useLocation();
  return user.username ? (
    <Outlet />
  ) : (
    <Navigate to={RoutesEnum.HOME} state={{ from: location }} replace />
  );
};

export default RequireAuth;
