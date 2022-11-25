import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

export function LoginPage() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  //needed to connect FE to BE with sessions (doesn't work without this)
  axios.defaults.withCredentials = true;

  const handleSubmit = () => {
    axios
      .post("http://localhost:4000/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (!response.data.auth) {
          setLoginStatus(false);
        } else {
          //this is how we are getting our token and saving it to local storage
          localStorage.setItem("token", response.data.token);
          setLoginStatus(true);
        }
      });
  };

  //this is what checks if the user has a valid JWT
  const userAuthenticated = () => {
    axios
      .get("http://localhost:4000/api/authenticated", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        //currently the response is "yo you are authenticated"
        console.log(response);
      });
  };

  useEffect(() => {
    //we have two routes which is fine because this is a get request getting info on if the user is logged in or not
    axios.get("http://localhost:4000/login").then((response) => {
      //only if the status of logged in is true do we want to show the username
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].email);
      }
    });
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const [email, password] = event.target.children;
        handleSubmit(email, password);
      }}
    >
      <label for="email">Email</label>
      <br />
      <input
        type="email"
        id="email"
        name="email"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <label for="password">Password</label>
      <br />
      <input
        type="password"
        id="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br></br>
      <button onClick={handleSubmit}>Login</button>
      {loginStatus && (
        <button onClick={userAuthenticated}> Check if authenticated</button>
      )}
    </form>
  );
}
