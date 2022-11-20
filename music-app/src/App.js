import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { useState } from "react";

function App() {
  const [token, setToken] = useState();

  //displays login page if token is falsy
  if (!token) {
    //passes the set token function to the login page component
    return <LoginPage setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </div>
  );
}

export default App;
