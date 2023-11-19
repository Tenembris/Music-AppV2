import { useState } from "react";
import "./index.css";

import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Player from "./Player";
import HomePage from "./HomePage";
import ProfileComponent from "./ProfilePage";
import Top50TracksComponent from "./Top50TracksComponent";
import Top50ArtistsComponent from "./Top50ArtistsComponent";
import RecommendationsComponent from "./RecommendationsComponent";

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
        <Route exact path="/top50tracks" element={<Top50TracksComponent />} />
        <Route exact path="/top50artists" element={<Top50ArtistsComponent />} />
        <Route
          exact
          path="/recommendations"
          element={<RecommendationsComponent />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
