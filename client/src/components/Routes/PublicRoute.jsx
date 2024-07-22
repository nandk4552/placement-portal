// PublicRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.rootReducer.user);
  const isAuthenticated = Boolean(user?._id);

  if (!isAuthenticated) {
    return children;
  } else {
    return (
      <Navigate
        to={
          user?.usertype === "student"
            ? "/student/placements"
            : "/admin/dashboard"
        }
      />
    );
  }
};

export default PublicRoute;
