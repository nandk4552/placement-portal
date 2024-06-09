import React from "react";
import DefaultLayout from "../../components/DefaultLayout/DefaultLayout";
import { Link } from "react-router-dom";
import "./PageNotFound.css"
const PageNotFound = () => {
  return (
    <DefaultLayout>
      {" "}
      <div className="pnf">
        <h1 className="pnf-title mb-0">404</h1>
        <h2 className="pnf-heading">Oops! Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          Go Back
        </Link>
      </div>
    </DefaultLayout>
  );
};

export default PageNotFound;
