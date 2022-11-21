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

export function LoginPage() {
  const handleSubmit = (email, password) => {
    //reqres registered sample user
    const loginPayload = {
      email: "eve.holt@reqres.in",
      password: "cityslicka",
    };

    axios
      .post("https://reqres.in/api/login", loginPayload)
      .then((response) => {
        //get token from response
        const token = response.data.token;

        //set JWT token to local
        localStorage.setItem("token", token);

        //set token to axios common header
        setAuthToken(token);

        //redirect user to home page
        window.location.href = "/dashboard";
      })
      .catch((err) => console.log(err));
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
      <input type="email" id="email" name="email" />
      <br />
      <label for="password">Password</label>
      <br />
      <input type="password" id="password" name="password" />
      <br></br>
      <input type="submit" value="Submit" />
    </form>
  );
}
