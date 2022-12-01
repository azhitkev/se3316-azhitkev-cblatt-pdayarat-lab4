import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { Dashboard } from "./Dashboard";

export const RouteGuard = ({ children }) => {
  var grantAccess = false;

  function userExistsAndEmailVerified() {
    if (auth.currentUser !== null) {
      if (
        auth.currentUser.emailVerified ||
        auth.currentUser.email === "admin@admin.com"
      ) {
        grantAccess = true;
      }
    }
    return grantAccess;
  }

  return userExistsAndEmailVerified() ? (
    <Dashboard {...children} />
  ) : (
    <Navigate to="/login" />
  );
};
