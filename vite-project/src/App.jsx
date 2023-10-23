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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfileComponent />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
