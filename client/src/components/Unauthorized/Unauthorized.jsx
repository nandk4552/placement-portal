// Unauthorized.js
import React from "react";
import { Result, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = location.state?.from || "/";
  const user = useSelector((state) => state.rootReducer.user);
  const userType = user?.usertype;

  // Define the dynamic home route based on user type
  const dynamicHomeRoute =
    userType === "student" ? "/student/placements" : "/admin/dashboard";

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <>
          <Button type="primary" onClick={() => navigate(previousLocation)}>
            Go Back
          </Button>
          <Button
            type="default"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate(dynamicHomeRoute)}
          >
            Back to Home
          </Button>
        </>
      }
    />
  );
};

export default Unauthorized;
