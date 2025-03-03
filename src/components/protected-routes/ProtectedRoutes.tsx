import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const user = useSelector((state: { user: { user: any } }) => state.user.user);

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
