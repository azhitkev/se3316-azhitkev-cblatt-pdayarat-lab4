import React from "react";
import { Route, Navigate } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const RouteGuard = ({ children, Component }) => {
  function hasJWT() {
    //can later check authentication of token in here
    let flag = false;

    //check user has JWT token
    localStorage.getItem("token") ? (flag = true) : (flag = false);

    return flag;
  }

  return hasJWT() ? <Dashboard {...children} /> : <Navigate to="/login" />;

  //   return (
  //     // <Route
  //     //   {...children}
  //     //   render={(children) =>
  //     //     hasJWT() ? (
  //     //       <Dashboard {...children} />
  //     //     ) : (
  //     //       <Navigate to={{ pathname: "/login" }} />
  //     //     )
  //     //   }
  //     // />
  //   );
};
