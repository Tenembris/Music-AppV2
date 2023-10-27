import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import axios from "axios";

function Player({ accessToken, trackUri }) {
  if (!accessToken) return null;
  console.log(accessToken);
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      uris={"spotify:track:2takcwOaAZWiXQijPHIx7B"}
    />
  );
}

export default Player;
