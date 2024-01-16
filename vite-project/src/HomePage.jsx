// No need to import React since it's not used in this file

// import {
//   CLIENT_ID,
//   CLIENT_SECRET,
//   SPOTIFY_AUTHORIZE_ENDPOINT,
//   REDIRECT_URL_AFTER_LOGIN,
//   SCOPES_URL_PARAM,
// } from "./auth";

const HomePage = () => {
  const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=cd5be52f32ac4bc884b551391ec442c6" +
    "&response_type=code" +
    "&redirect_uri=http://localhost:5173/profile" +
    "&scope=streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-top-read";
  return (
    <>
      <div className="main-wrapper">
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
        <a className="genre-button" href={AUTH_URL}>
          Login with spotify
        </a>
      </div>
    </>
  );
};

export default HomePage;
