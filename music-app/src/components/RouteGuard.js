import React from "react";
import { Route, Navigate } from "react-router-dom";

export const RouteGuard = ({ children, Component }) => {
  function hasJWT() {
    //can later check authentication of token in here
    let flag = false;

    //check user has JWT token
    localStorage.getItem("token") ? (flag = true) : (flag = false);

    return flag;
  }

  return (
    <Route
      {...children}
      render={(children) =>
        hasJWT() ? (
          <Component {...children} />
        ) : (
          <Navigate to={{ pathname: "/login" }} />
        )
      }
    />
  );
};
