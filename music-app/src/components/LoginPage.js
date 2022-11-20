import "../LoginPage.css";

export const LoginPage = () => {
  return (
    <form className="login-wrapper">
      <h1>Please Log In</h1>
      <label>
        <p>Username</p>
        <input type="text" />
      </label>
      <label>
        <p>Password</p>
        <input type="password" />
      </label>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
