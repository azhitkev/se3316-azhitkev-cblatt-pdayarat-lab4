// import "../LoginPage.css";

// export const LoginPage = () => {
//   return (
//     <form className="login-wrapper">
//       <h1>Please Log In</h1>
//       <label>
//         <p>Username</p>
//         <input type="text" />
//       </label>
//       <label>
//         <p>Password</p>
//         <input type="password" />
//       </label>
//       <div>
//         <button type="submit">Submit</button>
//       </div>
//     </form>
//   );
// };

import React from "react";
import axios from "axios";
import { setAuthToken } from "../helpers/setAuthToken";
import { useState } from "react";
import { data } from "jquery";

export function LoginPage() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const handleSubmit = () => {
    axios
      .post("http://localhost:4000/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          console.log(response);
          setLoginStatus(response.data[0].email);
        }
      });
  };

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
      <h1>{loginStatus}</h1>
    </form>
  );
}
