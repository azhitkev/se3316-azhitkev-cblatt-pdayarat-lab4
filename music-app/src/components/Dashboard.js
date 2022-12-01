import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { UnauthSearch } from "./UnauthSearch";

export const Dashboard = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("WE ARE HERE", auth.currentUser.email);
    if (auth.currentUser !== null) {
      Axios.get(`http://localhost:4000/role/${auth.currentUser.email}`).then(
        (response) => {
          setRole(response.data[0].role);
        }
      );
    }
  }, []);

  return (
    <div>
      {" "}
      What it looks like when members are signed in
      <h1>Role: {role}</h1>
      <UnauthSearch role={role} />
    </div>
  );
};
