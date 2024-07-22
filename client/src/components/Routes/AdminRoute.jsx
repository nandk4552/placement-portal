import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const user = useSelector((state) => state.rootReducer.user);

  useEffect(() => {
    const autoCheck = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/auth/admin-auth`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Admin auth check failed", error);
        setOk(false);
      }
    };

    if (user?._id) autoCheck();
  }, [user?._id]);

  return ok ? <Outlet /> : <Spinner />;
}
