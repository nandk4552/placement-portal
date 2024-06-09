import React from "react";
import DefaultLayout from "./DefaultLayout";
import { Skeleton } from "antd";

const LayoutLoader = () => {
  return (
    <DefaultLayout>
      <div
        style={{
          minHeight: "100vh", // Occupy the full viewport height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    </DefaultLayout>
  );
};

export default LayoutLoader;
