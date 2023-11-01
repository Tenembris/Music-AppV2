import { useState } from "react";
import "./index.css";

import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import HomePage from "./HomePage";
import ProfileComponent from "./ProfilePage";

const code = new URLSearchParams(window.location.search).get("code");

console.log(code);
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route
          exact
          path="/profile"
          element={<ProfileComponent code={code} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
