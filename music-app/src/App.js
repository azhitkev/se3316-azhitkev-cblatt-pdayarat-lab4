import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { RouteGuard } from "./components/RouteGuard";

import { history } from "./helpers/history";
// import { setAuthToken } from "./helpers/setAuthToken";
import { RegistrationForm } from "./components/RegistrationForm";
import { Logout } from "./components/Logout";
import { UnauthSearch } from "./components/UnauthSearch";
import { UnauthPlaylists } from "./components/UnauthPlaylists";
import PersonalAuthPlaylistView from "./components/personalAuthPlaylistView";
import PublicPlaylistView from "./components/publicPlaylistView";
import AuthPlaylistView from "./components/AuthPlaylistView";

function App() {
  //check jwt token
  // const token = localStorage.getItem("token");
  // if (token) {
  //   setAuthToken(token);
  // }

  return (
    <div className="wrapper">
      <Routes history={history}>
        <Route path="/register" element={<RegistrationForm />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/logged-out" element={<Logout />}></Route>
        <Route path="/unauth-search" element={<UnauthSearch />}></Route>
        <Route path="/unauth-playlists" element={<UnauthPlaylists />}></Route>
        <Route path="api/authenticated/personal/playlistview"element={<PersonalAuthPlaylistView />}></Route>
        <Route path="api/playlistview" element={<PublicPlaylistView />}></Route>
        <Route path="api/authenticated/playlistview" element={<AuthPlaylistView />}></Route>
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
