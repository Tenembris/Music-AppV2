import React, { useState, useEffect } from "react";
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

const App = () => {
  const [selectedTrackUri, setSelectedTrackUri] = useState(null);
  const [isPaused, setPaused] = useState(false);
  // dsadas
  const [isDivAdded, setIsDivAdded] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const code = new URLSearchParams(window.location.search).get("code");

  const togglePlayer = () => {
    setPaused((prev) => !prev);
  };

  const handleRecommendationClick = (uri) => {
    console.log("Selected Track URI:", uri);
    setSelectedTrackUri(uri);

    // Open the player if it's not open
    if (!isPlayerOpen) {
      togglePlayerClass();
    }
  };

  useEffect(() => {
    document.querySelectorAll(".PlayerRSWP").forEach((element) => {
      element.style.position = "fixed";
      element.style.bottom = "-100px";
      element.style.zIndex = "1000";
    });
  }, []);

  function togglePlayerClass() {
    console.log("togglePlayerClass called!");

    var existingDiv = document.querySelector("._ActionsRSWP.__1irer0f");

    if (existingDiv && !isDivAdded) {
      var newDiv = document.createElement("div");
      newDiv.className = "myNewDiv";

      var newButton = document.createElement("button");
      newButton.innerHTML = "Close";

      newButton.addEventListener("click", function () {
        console.log("Button clicked!");

        togglePlayer(); // Pause the music
        setIsPlayerOpen(false);

        document.querySelectorAll(".PlayerRSWP").forEach((element) => {
          element.style.bottom = "-100px";
          console.log("Player closed!");
        });
      });

      newDiv.appendChild(newButton);
      existingDiv.appendChild(newDiv);
      setIsDivAdded(true);
    }

    document.querySelectorAll(".PlayerRSWP").forEach((element) => {
      togglePlayer();
      if (isPlayerOpen) {
        setIsPlayerOpen(false);
        element.style.bottom = "-100px";
        console.log("Player closed!");
      } else {
        setIsPlayerOpen(true);
        element.style.bottom = "0";
        console.log("Player opened!");
      }
    });
  }

  return (
    <>
      <Player
        accessToken={accessToken}
        trackUri={selectedTrackUri}
        togglePlayer={togglePlayerClass}
        isPaused={isPaused}
      />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route
            exact
            path="/profile"
            element={
              <ProfileComponent
                code={code}
                onRecommendationClick={handleRecommendationClick}
                turnOffPlayer={togglePlayerClass}
              />
            }
          />
          <Route
            exact
            path="/top50tracks"
            element={
              <Top50TracksComponent
                onRecommendationClick={handleRecommendationClick}
              />
            }
          />
          <Route
            exact
            path="/top50artists"
            element={<Top50ArtistsComponent />}
          />
          <Route
            exact
            path="/recommendations"
            element={
              <RecommendationsComponent
                onRecommendationClick={handleRecommendationClick}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;
