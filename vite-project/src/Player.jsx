import React, { useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import axios from "axios";

function Player({ accessToken, trackUri, isPaused }) {
  if (!accessToken) return null;

  // console.log(accessToken);
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      uris={trackUri}
      play={!isPaused}
    />
  );
}

export default Player;
