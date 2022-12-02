import { Link } from "react-router-dom";

export const Logout = () => {
  return (
    <div>
      <Link to="/" style={{ marginLeft: "20px" }}>
        Home
      </Link>
      <h1> You are now logged out</h1>
    </div>
  );
};
