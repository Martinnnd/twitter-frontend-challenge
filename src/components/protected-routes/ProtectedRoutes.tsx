import { useEffect, useState } from "react";
import { Navigate, Outlet, useActionData } from "react-router-dom";
import { useHttpRequestService } from "../../service/HttpRequestService";
import Loader from "../loader/Loader";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const service = useHttpRequestService();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const authStatus = await service.isLogged();
        setIsAuthenticated(authStatus);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchAuth();
  }, [service]);

  if (isAuthenticated === null) {
    return <Loader />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoutes;
