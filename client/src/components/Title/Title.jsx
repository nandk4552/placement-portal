import React from "react";
import { Helmet } from "react-helmet-async";
const Title = ({
  title = "Placement Portal",
  description = "To Handle VJIT placement cell master data",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
