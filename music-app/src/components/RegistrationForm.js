import { useState } from "react";
import axios from "axios";

export const RegistrationForm = () => {
  const [firstNameReg, setFirstName] = useState(null);
  const [lastNameReg, setLastName] = useState(null);
  const [emailReg, setEmail] = useState(null);
  const [passwordReg, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const handleInputChange = (e) => {
    //you get the id and value entered in the input box
    const { id, value } = e.target;
    //if id is firstName, you set the setFirstName to the value in the input box (so on for the other ones)
    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
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

  const handleRegisterBtn = () => {
    axios
      .post("http://localhost:4000/register", {
        first_name: firstNameReg,
        last_name: lastNameReg,
        email: emailReg,
        password: passwordReg,
      })
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <div className="form">
      <h3>Registration</h3>
      <div className="form-body">
        <div className="username">
          <label className="form__label" for="firstName">
            First Name{" "}
          </label>
          <input
            className="form__input"
            type="text"
            value={firstNameReg}
            onChange={(e) => handleInputChange(e)}
            id="firstName"
            placeholder="First Name"
          />
        </div>
        <div className="lastname">
          <label className="form__label" for="lastName">
            Last Name{" "}
          </label>
          <input
            type="text"
            name=""
            id="lastName"
            value={lastNameReg}
            onChange={(e) => handleInputChange(e)}
            className="form__input"
            placeholder="LastName"
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
        <button type="submit" onClick={() => handleRegisterBtn()} class="btn">
          Register
        </button>
      </div>
    </div>
  );
};
