import React, { useEffect, useState } from "react";
import axios from "axios";
import Player from "./Player";

const ProfilePage = () => {
  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState({});
  const [artists, setArtists] = useState({});
  const [tracks, setTracks] = useState({});
  const [profile, setProfile] = useState({});
  const [sortedGenreNames, setSortedGenreNames] = useState([]);
  const [mood, setMood] = useState([]);
  const [genres, setGenres] = useState([]);
  // const [plaingTrack, setPlayingTrack] = useState({});

  console.log("Token:", token);

  let timePeriod = "long_term";
  const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
  const TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=${timePeriod}&limit=10`;
  const ARTISTS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10";
  const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
  const GENRES_ENDPOINT = `https://api.spotify.com/v1/artists/26JloX1vHxGGrGUVeMItFJ`;
  const ARTISTS_ENDPOINT2 =
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=100";
  const MOOD_ENDPOINT =
    "https://api.spotify.com/v1/audio-features?ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B";

  // const checkToken = async (accessToken) => {
  //   try {
  //     const response = await axios.get("https://api.spotify.com/v1/me", {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       console.log("Token is valid!");
  //     } else {
  //       console.log("Unexpected response:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error checking token:", error);
  //   }
  // };

  // // Replace 'YOUR_ACCESS_TOKEN' with your actual access token
  // checkToken("YOUR_ACCESS_TOKEN");

  const getData = async (endpoint, setFunction, storageKey) => {
    const storedData = sessionStorage.getItem(storageKey);

    if (storedData) {
      setFunction(JSON.parse(storedData));
    } else {
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("tokens"),
          },
        });
        setFunction(response.data);
        sessionStorage.setItem(storageKey, JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getGenres = async () => {
    try {
      const response = await axios.get(ARTISTS_ENDPOINT2, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tokens"),
        },
      });
      const artists = response.data.items;
      const genresCount = {};

      artists.forEach((artist) => {
        artist.genres.forEach((genre) => {
          if (genresCount[genre]) {
            genresCount[genre] += 1;
          } else {
            genresCount[genre] = 1;
          }
        });
      });
      const sortedGenres = Object.entries(genresCount).sort(
        (a, b) => b[1] - a[1]
      );
      const sortedGenreNames = sortedGenres.map(([genre, count]) => genre);

      setSortedGenreNames(sortedGenreNames);
    } catch (error) {
      console.error(error);
    }
  };

  // function chooseTrack(tracks) {
  //   setPlayingTrack(tracks);
  // }

  useEffect(() => {
    const fetchData = async () => {
      await getGenres();
      getData(PLAYLISTS_ENDPOINT, setPlaylists, "playlistsSessionData");
      getData(TRACKS_ENDPOINT, setTracks, "tracksSessionData");
      getData(ARTISTS_ENDPOINT, setArtists, "artistsSessionData");
      getData(PROFILE_ENDPOINT, setProfile, "profileSessionData");
      getData(GENRES_ENDPOINT, setGenres, "genresSessionData");
      getData(MOOD_ENDPOINT, setMood, "moodSessionData");
    };

    fetchData();
  }, []);

  const getParamsFromHash = (hash) => {
    const hashContent = hash.substring(1);
    const paramsInUrl = hashContent.split("&");
    let params = {};
    let values = [];
    paramsInUrl.forEach((param) => {
      values = param.split("=");
      params[values[0]] = values[1];
    });
    return params;
  };

  useEffect(() => {
    setToken(localStorage.getItem("tokens"));
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("tokens");
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      const tokens = getParamsFromHash(hash);
      localStorage.setItem("tokens", tokens.access_token);
      setToken(tokens.access_token);
      window.history.pushState({}, null, "/profile");
    }
    getData(PLAYLISTS_ENDPOINT, setPlaylists, "playlistsSessionData");
    getData(TRACKS_ENDPOINT, setTracks, "tracksSessionData");
    getData(ARTISTS_ENDPOINT, setArtists, "artistsSessionData");
    getData(PROFILE_ENDPOINT, setProfile, "profileSessionData");
    getData(GENRES_ENDPOINT, setGenres, "genresSessionData");
    getData(MOOD_ENDPOINT, setMood, "moodSessionData");
  }, []);

  const getNewData = (time_range, type) => {
    let updatedEndpoint = `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=10`;
    if (type === "tracks") {
      getData(updatedEndpoint, setTracks, `tracksSessionData2${time_range}`);
    } else {
      getData(updatedEndpoint, setArtists, `artistsSessionData2${time_range}`);
    }
  };

  return (
    <div className="DivGridTop">
      {profile.display_name && profile.images && (
        <div className="ProfileSection">
          <img src={profile.images[0]?.url} alt="" />
          <h2>{profile.display_name}</h2>
        </div>
      )}
      {tracks.items && (
        <div>
          <div className="grid2ColumnsTops">
            <div>
              <h2>Top Tracks</h2>
              <button onClick={() => getNewData("long_term", "tracks")}>
                All time
              </button>
              <button onClick={() => getNewData("medium_term", "tracks")}>
                6 month
              </button>

              <button onClick={() => getNewData("short_term", "tracks")}>
                a month
              </button>

              <div className="top10Tracks">
                {tracks.items.map((track, index) => {
                  return (
                    <div key={index}>
                      <div className="TopElements">
                        <h2>{track.name}</h2>
                        <img src={track.album.images[0]?.url} alt="" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h2>Top Artists</h2>
              <div>
                <button
                  onClick={() => getNewData("long_term", "artists")}
                  value={"long_term"}
                >
                  All time
                </button>
                <button
                  onClick={() => getNewData("medium_term", "artists")}
                  value={"medium_term"}
                >
                  {" "}
                  6 month
                </button>
                <button
                  onClick={() => getNewData("short_term", "artists")}
                  value={"short_term"}
                >
                  a month
                </button>
              </div>
              <div className="top10Tracks">
                {artists.items.map((artists, index) => {
                  return (
                    <div key={index}>
                      <div className="TopElements">
                        <h2>{artists.name}</h2>
                        <img src={artists.images[0]?.url} alt="" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div>
              <h2>Playlists</h2>
              <div className="top10Tracks">
                {playlists.items.map((playlist, index) => {
                  return (
                    <div key={index}>
                      <div className="TopElements">
                        <h2>{playlist.name}</h2>
                        <img src={playlist.images[0]?.url} alt="" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
          <div>
            <h2>Top Genres</h2>
            <ul>
              {sortedGenreNames.slice(0, 10).map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <Player
        accessToken={token}
        trackUri={"spotify:track:71UrHWK2SDzxY5rudwc74Z"}
      />
    </div>
  );
};

export default ProfilePage;
