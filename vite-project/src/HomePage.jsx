// No need to import React since it's not used in this file

import {
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_AUTHORIZE_ENDPOINT,
  REDIRECT_URL_AFTER_LOGIN,
  SCOPES_URL_PARAM,
} from "./auth";

const HomePage = () => {
  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_url=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };
  return (
    <>
      <div className="wrapper">
        <div className="static-txt">Find your Spotify</div>
        <ul className="dynamic-txts">
          <li>
            <span>stats</span>
          </li>
          <li>
            <span>mixes</span>
          </li>
          <li>
            <span>vocals</span>
          </li>
          <li>
            <span>music</span>
          </li>
        </ul>
      </div>
      <button onClick={() => handleLogin()}>Login</button>
    </>
  );
};

export default HomePage;
