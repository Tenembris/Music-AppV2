// // Example
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173/profile",
    clientId: "cd5be52f32ac4bc884b551391ec442c6",
    clientSecret: "21b5bb2c75ff4af3a5788351fc5c2c73",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  console.log("login route acces", code);
  console.log(2, code);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173/profile",
    clientId: "cd5be52f32ac4bc884b551391ec442c6",
    clientSecret: "21b5bb2c75ff4af3a5788351fc5c2c73",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log("success");
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("hi");
      console.log(code);
      res.sendStatus(400);
    });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
