import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/logged-out");
    console.log("logged out");
  };

  return (
    <div>
      {" "}
      What it looks like when members are signed in
      <button onClick={logout}>Log out</button>
    </div>
  );
};
