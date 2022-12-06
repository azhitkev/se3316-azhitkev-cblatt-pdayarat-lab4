import { useEffect, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { Link } from "react-router-dom";

export const RegistrationForm = () => {
  const [usernameReg, setUsername] = useState(null);
  const [emailReg, setEmail] = useState(null);
  const [passwordReg, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  let userExists;

  useEffect(() => {
    userExistsCheck();
  }, []);

  const register = async () => {
    try {
      //add if passwordreg == confirmpassword
      const user = await createUserWithEmailAndPassword(
        auth,
        emailReg,
        passwordReg
      );
      await sendEmailVerification(auth.currentUser);
      auth.signOut();
      console.log(user);
      userExists = false;
      userExistsCheck();
    } catch (error) {
      console.log(error.message);
      userExists = true;
      alert(error.message);
    }
  };

  async function userExistsCheck() {
    console.log("in here");
    if (userExists === false) {
      console.log("not in here");
      axios
        .post("http://localhost:4000/register", {
          username: usernameReg,
          email: emailReg,
          password: passwordReg,
        })
        .then((response) => {
          console.log(response);
        });
    }
  }

  const handleInputChange = (e) => {
    //you get the id and value entered in the input box
    const { id, value } = e.target;
    //if id is usernme, you set the setUsername to the value in the input box (so on for the other ones)
    if (id === "username") {
      setUsername(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  //   const handleRegisterBtn = () => {
  //     axios
  //       .post("http://localhost:4000/register", {
  //         first_name: firstNameReg,
  //         last_name: lastNameReg,
  //         email: emailReg,
  //         password: passwordReg,
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       });
  //   };

  return (
    <div className="form">
      <Link to="/" style={{ marginLeft: "20px" }}>
        Home
      </Link>
      <h3>Registration</h3>
      <div className="form-body">
        <div className="username">
          <label className="form__label" for="username">
            Username{" "}
          </label>
          <input
            type="text"
            id="username"
            value={usernameReg}
            onChange={(e) => handleInputChange(e)}
            className="form__input"
            placeholder="Username"
          />
        </div>
        <div className="email">
          <label className="form__label" for="email">
            Email{" "}
          </label>
          <input
            type="email"
            id="email"
            value={emailReg}
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
            id="password"
            value={passwordReg}
            onChange={(e) => handleInputChange(e)}
            placeholder="Password"
          />
        </div>
        <div className="confirm-password">
          <label className="form__label" for="confirmPassword">
            Confirm Password{" "}
          </label>
          <input
            className="form__input"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e)}
            placeholder="Confirm Password"
          />
        </div>
      </div>
      <div class="footer">
        <button
          type="submit"
          onClick={() => register()}
          class="btn"
          id="register-btn"
        >
          Register
        </button>
      </div>
    </div>
  );
};
