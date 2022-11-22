import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { RouteGuard } from "./components/RouteGuard";

import { history } from "./helpers/history";
import { setAuthToken } from "./helpers/setAuthToken";
import { RegistrationForm } from "./components/RegistrationForm";

function App() {
  //check jwt token
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }

  return (
    <div className="wrapper">
      <Routes history={history}>
        <Route path="/" element={<RegistrationForm />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }
        />
        '
      </Routes>
    </div>
  );
}

export default App;
