import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children, userType }) => {
  const user = useSelector((state) => state.rootReducer.user);
  const isAuthenticated = Boolean(user?._id);
  const currentUserType = user?.usertype;
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User Type from Redux:", currentUserType);
    console.log("Required User Type:", userType);
    if (isAuthenticated) {
      if (currentUserType !== userType) {
        navigate("/unauthorized", { state: { from: location } });
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, currentUserType, userType, navigate, location]);

  if (isAuthenticated && currentUserType === userType) {
    return children;
  }

  return null;
};

export default ProtectedRoutes;
