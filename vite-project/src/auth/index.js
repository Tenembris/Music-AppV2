export const CLIENT_ID = "cd5be52f32ac4bc884b551391ec442c6";
export const CLIENT_SECRET = "21b5bb2c75ff4af3a5788351fc5c2c73";
export const SPOTIFY_AUTHORIZE_ENDPOINT =
  "https://accounts.spotify.com/authorize";
export const REDIRECT_URL_AFTER_LOGIN = "http://localhost:5173/profile";
export const SPACE_DELIMITER = "%20";
export const SCOPES = [
  "user-top-read",
  "user-read-private",
  "user-library-read",
  "playlist-read-private",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
];

export const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
