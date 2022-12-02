import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { UnauthSearch } from "./UnauthSearch";

export const Dashboard = () => {
  const [role, setRole] = useState("");
  const [userName, setUser] = useState("");
  const navigate = useNavigate();
  // let deactivated = false;

  useEffect(() => {
    console.log("WE ARE HERE", auth.currentUser.email);
    if (auth.currentUser !== null) {
      Axios.get(
        `http://localhost:4000/roleAndUsername/${auth.currentUser.email}`
      ).then((response) => {
        setRole(response.data[0].role);
        setUser(response.data[0].username);
      });
    }
    // ifUserDeactivated();
  }, []);

  // function ifUserDeactivated() {
  //   if (role === "deactivated") {
  //     navigate("/");
  //     signOut(auth.currentUser);
  //     console.log("logged out");
  //     deactivated = true;
  //   }
  // }

  const logout = async () => {
    console.log(auth.currentUser);
    await signOut(auth);
    console.log("logged out");
    navigate("/");
    alert("Admin has been contacted");
  };

  return (
    <div>
      {" "}

      {role === "deactivated" && (
        <h1>
          Your accounted status is: deactivated. Please contact Admin to fix
          this.
        </h1>
      )}
      {role === "deactivated" && (
        <button onClick={logout}>Contact Admin.</button>
      )}
      {role !== "deactivated" && (
        <h1 style={{ marginLeft: "20px" }}>Role: {role}</h1>
      )}
      {role !== "deactivated" && (
        <h3 style={{ marginLeft: "20px" }}>User: {userName}</h3>
      )}
      {role !== "deactivated" && (
        <UnauthSearch role={role} userName={userName} />
      )}

    </div>
  );
};
