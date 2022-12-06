import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { Axios } from "axios";

export function LoginPage() {
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [emailLogin, setEmailLogin] = useState(null);
  const [passwordLogin, setPasswordLogin] = useState(null);
  const navigate = useNavigate();
  let userRole;

<<<<<<< Updated upstream
  // //checks the role of the user upon login (to see whether they should have admin priviledges or regular user priviledges)
  const checkUserRole = async () => {
    userRole = await fetch(
      `http://localhost:4000/userInfo/${auth.currentUser.email}`
    );
    userRole = await userRole.json();
    console.log("THE USER ROLE IS:" + userRole);
  };

  const sendPasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, emailLogin);
      alert("Password reset link sent!");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
=======
  const [loginStatus, setLoginStatus] = useState(false);

  //needed to connect FE to BE with sessions (doesn't work without this)
  axios.defaults.withCredentials = true;

  const handleSubmit = () => {
    axios
      .post("/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
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
      .get("/api/authenticated", {
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
    axios.get("/login").then((response) => {
      //only if the status of logged in is true do we want to show the username
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].email);
      }
>>>>>>> Stashed changes
    });
    if (auth.currentUser !== null) {
      Axios.get(
        `http://localhost:4000/roleAndUsername/${auth.currentUser.email}`
      ).then((response) => {
        setRole(response.data[0].role);
        // setUser(response.data[0].userName);
      });
    }
  }, []);

  const handleInputChange = (e) => {
    //you get the id and value entered in the input box
    const { id, value } = e.target;
    //if id is firstName, you set the setFirstName to the value in the input box (so on for the other ones)
    if (id === "email-login") {
      setEmailLogin(value);
    }
    if (id === "password-login") {
      setPasswordLogin(value);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        emailLogin,
        passwordLogin
      );
    } catch (error) {
      let message = error.message;
      console.log(message);
      document.getElementById("error-message").innerText = error.message;
      console.log("This is the error message", error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    console.log("logged out");
  };

  return (
    <div className="form">
      <Link to="/" style={{ marginLeft: "20px" }}>
        Home
      </Link>
      <h3>Login</h3>
      <div className="form-body">
        <div className="email">
          <label className="form__label" for="email">
            Email{" "}
          </label>
          <input
            type="email"
            id="email-login"
            value={emailLogin}
            onChange={(e) => handleInputChange(e)}
            className="form__input"
            placeholder="Email"
          />
        </div>
        <div className="password">
          <label className="form__label" for="password">
            Password{" "}
          </label>
          <input
            className="form__input"
            type="password"
            id="password-login"
            value={passwordLogin}
            onChange={(e) => handleInputChange(e)}
            placeholder="Password"
          />
        </div>
      </div>
      <div id="error-message"></div>
      <div class="footer">
        {/* this renders if the user did not verify their email */}
        {user?.email && !user?.emailVerified && (
          <h2>Please verify your account in order to log in.</h2>
        )}
        {user?.emailVerified && navigate("/dashboard")}
        {user?.email === "admin@admin.com" && navigate("/dashboard")}
        <button type="submit" onClick={login} class="btn">
          Login
        </button>
        <button type="submit" onClick={logout} class="btn">
          Log Out
        </button>
        <button onClick={() => sendPasswordReset(emailLogin)}>
          Change password
        </button>
      </div>
    </div>
  );
}
