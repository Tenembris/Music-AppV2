import React, { useEffect, useState } from "react";
import axios from "axios";
import Player from "./Player";
import useAuth from "./useAuth";
// import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ProfilePage = ({ code }) => {
  const accessToken = useAuth(code);
  // const history = useHistory();

  // const handleButtonClick = () => {
  //   history.push("/top50");
  // };

  const [playlists, setPlaylists] = useState({});
  const [artists, setArtists] = useState({});
  const [tracks, setTracks] = useState([]);
  const [profile, setProfile] = useState({});
  const [sortedGenreNames, setSortedGenreNames] = useState([]);
  const [mood, setMood] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const [tracks2, setTracks2] = useState([]);
  const [longArtists, setLongArtists] = useState([]);
  const [topArtistsTrack, setTopArtistsTrack] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isDivAdded, setIsDivAdded] = useState(false);
  const [isPaused, setPaused] = useState(false);

  const togglePlayer = () => {
    setPaused((prev) => !prev);
  };

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Top Genres",
        data: [],
        backgroundColor: "rgba(0, 99, 132, 0.2)",
        borderColor: "rgba(245, 1, 1, 1)",
        borderWidth: 2,
      },
    ],
    options: {
      plugins: {
        title: {
          display: true,
          text: "Custom Grid Color",
        },
        scale: {
          r: {
            grid: {
              color: "rgba(245, 1, 1, 0.1)",
            },
          },
        },
      },
    },
  });

  // console.log("Token:", accessToken);

  let timePeriod = "long_term";
  const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
  const TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=${timePeriod}&limit=12`;
  const TRACKS_ENDPOINT2 = `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50`;
  // const TOP_ARTIST_TRACK = `https://api.spotify.com/v1/artists/${longArtists[0].items[0]?.id}/top-tracks`;

  const ARTISTS_ENDPOINT =
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=12";
  const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
  const GENRES_ENDPOINT = `https://api.spotify.com/v1/artists/26JloX1vHxGGrGUVeMItFJ`;
  const ARTISTS_ENDPOINT2 =
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=100";

  const MOOD_ENDPOINT =
    "https://api.spotify.com/v1/audio-features?ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B";

  const AVAIBLE_GENRES =
    "https://api.spotify.com/v1/recommendations/available-genre-seeds";
  // Function to fetch data
  const getData = async (endpoint, setFunction, storageKey) => {
    const storedData = sessionStorage.getItem(storageKey);

    if (storedData) {
      setFunction(JSON.parse(storedData));
    } else {
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });

        setFunction(response.data);
        sessionStorage.setItem(storageKey, JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    var existingDiv = document.querySelector("._ActionsRSWP.__1irer0f");

    if (existingDiv) {
      var newDiv = document.createElement("div");
      newDiv.className = "myNewDiv";

      var newButton = document.createElement("button");
      newButton.innerHTML = "Mój przycisk";

      newButton.addEventListener("click", function () {
        console.log("Button clicked!");
      });

      newDiv.appendChild(newButton);
      existingDiv.appendChild(newDiv);
    }
  }, []);

  // Function to get genres
  const getGenres = async () => {
    try {
      const response = await axios.get(ARTISTS_ENDPOINT2, {
        headers: {
          Authorization: "Bearer " + accessToken,
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

      const sortedGenres = Object.entries(genresCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Wybierz 6 najpopularniejszych gatunków (lub dowolną inną liczbę)

      const sortedGenreNames = sortedGenres.map(([genre, count]) => genre);
      const sortedGenreCounts = sortedGenres.map(([genre, count]) => count);

      setData({
        labels: sortedGenreNames,
        datasets: [
          {
            label: "Top Genres",
            data: sortedGenreCounts,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
        options: {
          scales: {
            r: {
              grid: {
                color: "rgba(245, 1, 1, 0.2)",
                lineWidth: 3,
              },
              ticks: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 16, // Zwiększenie rozmiaru etykiet legendy
                },
              },
            },
            title: {
              display: true,
              text: "Custom Grid Color",
              font: {
                size: 30, // Zwiększenie rozmiaru tytułu
              },
            },
            tooltip: {
              titleFont: {
                size: 16, // Zwiększenie rozmiaru tytułu tooltipu
              },
              bodyFont: {
                size: 20, // Zwiększenie rozmiaru tekstu w tooltipie
              },
            },
          },
          layout: {
            padding: {
              top: 20, // Dostosowanie wcięcia na górze
              bottom: 20, // Dostosowanie wcięcia na dole
            },
          },
        },
      });
      setSortedGenreNames(sortedGenreNames);
    } catch (error) {
      console.error(error);
    }
  };

  function togglePlayerClass() {
    console.log(isDivAdded);

    document.querySelectorAll(".PlayerRSWP").forEach((element) => {
      element.classList.add("open");

      if (!isDivAdded) {
        var existingDiv = document.querySelector("._ActionsRSWP.__1irer0f");

        if (existingDiv) {
          var newDiv = document.createElement("div");
          newDiv.className = "myNewDiv";

          var newButton = document.createElement("button");
          newButton.innerHTML = "Close";

          newButton.addEventListener("click", function () {
            document.querySelectorAll(".PlayerRSWP").forEach((element) => {
              element.classList.remove("open");
              togglePlayer();
            });

            console.log("Button clicked!");
          });

          newDiv.appendChild(newButton);
          existingDiv.appendChild(newDiv);
          setIsDivAdded(true);
        }
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await getGenres();
      getData(PLAYLISTS_ENDPOINT, setPlaylists, "playlistsSessionData");
      getData(TRACKS_ENDPOINT, setTracks, "tracksSessionData");
      getData(ARTISTS_ENDPOINT, setArtists, "artistsSessionData");
      getData(PROFILE_ENDPOINT, setProfile, "profileSessionData");
      getData(GENRES_ENDPOINT, setGenres, "genresSessionData");
      getData(TRACKS_ENDPOINT2, setTracks2, "tracksSessionData2long_term");
      getData(MOOD_ENDPOINT, setMood, "moodSessionData");
      getData(ARTISTS_ENDPOINT2, setLongArtists, "longArtistsSessionData");
      getData(
        TOP_ARTIST_TRACK,
        setTopArtistsTrack,
        "topArtistsTrackSessionData"
      );
      getMoodDataForTracks();
    };

    getData(AVAIBLE_GENRES, setGenres, "AvaiblegenresSessionData");

    getData(recommendedTracks, setRecommendedTracks, "recommendedTracks");

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
    // setToken(localStorage.getItem("tokens"));
  }, [accessToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem("tokens");
    if (storedToken !== accessToken) {
      // setToken(storedToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      const tokens = getParamsFromHash(hash);
      localStorage.setItem("tokens", tokens.access_token);
      // setToken(accessToken.access_token);
      window.history.pushState({}, null, "/profile");
    }
    // getData(PLAYLISTS_ENDPOINT, setPlaylists, "playlistsSessionData");
    // getData(TRACKS_ENDPOINT, setTracks, "tracksSessionData");
    // getData(ARTISTS_ENDPOINT, setArtists, "artistsSessionData");
    // getData(PROFILE_ENDPOINT, setProfile, "profileSessionData");
    // getData(GENRES_ENDPOINT, setGenres, "genresSessionData");
    // getData(MOOD_ENDPOINT, setMood, "moodSessionData");
  }, []);
  const getNewData = (time_range, type) => {
    let updatedEndpoint = `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=12`;
    if (type === "tracks") {
      getData(updatedEndpoint, setTracks, `tracksSessionData2${time_range}`);
    } else {
      getData(updatedEndpoint, setArtists, `artistsSessionData2${time_range}`);
    }
  };

  const [selectedTrackUri, setSelectedTrackUri] = useState(null);

  const handleTrackClick = (uri) => {
    setSelectedTrackUri(uri);
  };

  const getMoodDataForTracks = async () => {
    try {
      const response = await axios.get(TRACKS_ENDPOINT2, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      const trackIds = response.data.items.map((track) => track.id).join("%2C");

      const moodEndpoint = `https://api.spotify.com/v1/audio-features?ids=${trackIds}`;
      console.log("MOOD_ENDPOINT with track IDs:", moodEndpoint, trackIds);

      // Pobierz mood data i zaktualizuj stan mood
      getData(moodEndpoint, setMood, "moodSessionData");

      return trackIds;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const calculateAverageMoodData = (moodData) => {
    if (moodData === null) return;
    // Inicjalizuj obiekt, który będzie przechowywał sumy cech
    const sum = {
      acousticness: 0,
      danceability: 0,
      energy: 0,
      key: 0,
      loudness: 0,
      mode: 0,
      speechiness: 0,
      liveness: 0,
      valence: 0,
      tempo: 0,
      instrumentalness: 0,

      // Dodaj inne cechy w razie potrzeby
    };

    // Pobierz tablicę audio_features z moodData
    const audioFeatures = moodData.audio_features;

    // Iteruj przez tablicę audio_features
    audioFeatures.forEach((feature) => {
      // Iteruj przez klucze (cechy) w obiekcie
      Object.keys(feature).forEach((key) => {
        // Jeśli klucz istnieje w obiekcie sum, dodaj jego wartość
        if (Object.prototype.hasOwnProperty.call(sum, key)) {
          sum[key] += feature[key];
        }
      });
    });

    // Podziel sumy przez liczbę elementów
    Object.keys(sum).forEach((key) => {
      sum[key] /= audioFeatures.length;
    });

    return sum;
  };

  // Przykład użycia z obiektem moodSessionData z sessionStorage
  const moodSessionData = JSON.parse(sessionStorage.getItem("moodSessionData"));
  const averageMoodData = calculateAverageMoodData(moodSessionData);
  console.log(averageMoodData);

  // useEffect(() => {
  //   const element = document.querySelector(".favSong");
  //   const backgroundImage = element.style.backgroundImage;

  //   if (backgroundImage) {
  //     const imageUrl = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/)[1];

  //     const img = new Image();
  //     img.src = imageUrl;

  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);
  //       const imageData = ctx.getImageData(0, 0, img.width, img.height);

  //       let sum = 0;
  //       for (let i = 0; i < imageData.data.length; i += 4) {
  //         sum +=
  //           imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
  //       }

  //       const brightness = sum / ((imageData.data.length / 4) * 255);
  //       setIsLightBackground(brightness > 0.5); // Adjust the threshold as needed
  //     };
  //   }
  // }, []);

  // Wywołaj funkcję

  const storedData = JSON.parse(
    sessionStorage.getItem("tracksSessionData2long_term")
  );

  const storedArtists = JSON.parse(
    sessionStorage.getItem("artistsSessionData")
  );

  const backgroundImage =
    storedData && storedData.items[0]?.album?.images[0]?.url;

  return (
    <div className="DivGridTop">
      {profile.display_name && profile.images && (
        <div className="ProfileSection">
          <div className="profilePhoto">
            <img src={profile.images[1]?.url} alt="" />
          </div>
          <h2>{profile.display_name}</h2>
          <div className="NavButtons">
            <button>Your Page</button>

            <Link to="/top50artists" className="button-link">
              Top 50 artists
            </Link>

            <Link to="/top50tracks" className="button-link">
              Top 50 Tracks
            </Link>

            <Link to="/recommendations" className="button-link">
              recommendations
            </Link>
          </div>
        </div>
      )}
      {tracks.items && (
        <div>
          <div className="section">
            <div
              className="favSong"
              style={{
                background: `url(${storedData.items[0]?.album?.images[0]?.url}) no-repeat center center`,
                backgroundSize: "cover",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="blurTruck">
                <h2>Fav Song</h2>
                <div>
                  <div className="informationContainer">
                    <div
                      className="TrackInfo"
                      style={{ color: isLightBackground ? "black" : "white" }}
                    >
                      <div>
                        <h3>{storedData.items[0]?.name}</h3>
                        <h4 htmlFor="">Title</h4>
                      </div>
                      <div>
                        <h3>{tracks2.items[0]?.artists[0]?.name}</h3>
                        <h4 htmlFor="">Artists</h4>
                      </div>
                      <div>
                        <h3>{tracks2.items[0]?.album?.release_date}</h3>
                        <h4 htmlFor="">Release Date</h4>
                      </div>
                      <div>
                        <h3>{mood?.audio_features[0]?.tempo}</h3>
                        <h4>Tempo</h4>
                      </div>
                      <div>
                        <h3>{genres.genres}</h3>
                        <h4 htmlFor="">Genre</h4>
                      </div>
                    </div>
                    <img
                      className="shadow"
                      src={tracks2.items[0]?.album?.images[1]?.url}
                      onClick={() => handleTrackClick(tracks.items[0].uri)}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="longerSection">
            <div className="TopContainer">
              <div>
                <h2>Top Tracks</h2>
                <div className="termsButtonContainer">
                  <button onClick={() => getNewData("long_term", "tracks")}>
                    All time
                  </button>
                  <button onClick={() => getNewData("medium_term", "tracks")}>
                    6 month
                  </button>

                  <button onClick={() => getNewData("short_term", "tracks")}>
                    a month
                  </button>
                </div>
              </div>

              <div className="top10Tracks">
                <div className="TracksWrapper">
                  {[0, 1, 2].map((columnIndex) => (
                    <div key={columnIndex} className="TrackColumn">
                      {tracks.items
                        .slice(columnIndex * 4, columnIndex * 4 + 4)
                        .map((track, index) => (
                          <div key={index} className="TopElements">
                            <h3>
                              {index + 1 + columnIndex * 4} / {track.name}
                            </h3>
                            <img
                              src={track.album.images[1]?.url}
                              onClick={() => {
                                handleTrackClick(track.uri);
                                togglePlayerClass();
                              }}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div
              className="favSong"
              style={{
                background: `url(${longArtists.items[0]?.images[0]?.url}) no-repeat center center`,
                backgroundSize: "cover",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="blurTruck">
                <h2>Fav Artist</h2>
                <div>
                  <div className="informationContainer">
                    <div
                      className="TrackInfo"
                      style={{ color: isLightBackground ? "black" : "white" }}
                    >
                      <div>
                        <h3>{longArtists.items[0]?.name}</h3>
                        <h4 htmlFor="">Name</h4>
                      </div>

                      <div>
                        {longArtists.items[0]?.genres.length > 0 ? (
                          <h3>{longArtists.items[0]?.genres}</h3>
                        ) : (
                          <h3>-</h3>
                        )}
                        <h4 htmlFor="">Genre</h4>
                      </div>

                      <div>
                        <h3>{longArtists?.items[0].popularity}</h3>
                        <h4 htmlFor="">Populatity</h4>
                      </div>
                    </div>
                    <img
                      className="shadow"
                      src={longArtists.items[0]?.images[1]?.url}
                      onClick={() => {
                        handleTrackClick(tracks.items[0].uri);
                      }}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="longerSection">
            <div className="TopContainer">
              <div>
                <h2>Top Artists</h2>
                <div className="termsButtonContainer">
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
                  <div className="TracksWrapper">
                    {[0, 1, 2].map((columnIndex) => (
                      <div key={columnIndex} className="TrackColumn">
                        {artists.items
                          .slice(columnIndex * 4, columnIndex * 4 + 4)
                          .map((artist, index) => (
                            <div key={index} className="TopElements">
                              <h3>
                                {index + 1 + columnIndex * 4} / {artist.name}
                              </h3>
                              <img
                                src={artist.images[0]?.url}
                                alt=""
                                loading="lazy"
                              />
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
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
          <div className="section">
            <div className="blurTruck">
              <h2>Top Genres</h2>
              <div className="topGenreSection">
                <ul>
                  {sortedGenreNames.slice(0, 10).map((genre, index) => (
                    <li key={index}>
                      {index + 1} / {genre}
                    </li>
                  ))}
                </ul>

                <div className="radarComponent">
                  <Radar data={data} options={data.options} />
                </div>
              </div>
            </div>
          </div>
          <div className="longerSection">
            <div className="MoodContainer">
              <h2>Moods</h2>

              <div>
                <h3 className="textContainer">
                  Explore Your Music Mood: Dive into a personalized analysis of
                  your musical journey spanning over the past few years.
                </h3>
                <div style={{ width: "100vw" }}>
                  <div className="progresBars">
                    <div className="progresBarElements">
                      <label className="optionFirst">unrhytmical</label>
                      <progress
                        className="moods"
                        max={1}
                        value={averageMoodData.danceability}
                      ></progress>
                      <label className="optionSecond">danceable</label>
                    </div>

                    <div className="progresBarElements">
                      <label className="optionFirst">energical</label>
                      <progress
                        className="moods"
                        max={1}
                        value={averageMoodData.energy}
                      ></progress>
                      <label className="optionSecond">relaxing</label>
                    </div>

                    <div className="progresBarElements">
                      <label className="optionFirst">acustical</label>
                      <progress
                        className="moods"
                        max={1}
                        value={averageMoodData.acousticness}
                      ></progress>
                      <label className="optionSecond">electric</label>
                    </div>

                    <div className="progresBarElements">
                      <label className="optionFirst">studio</label>
                      <progress
                        className="moods"
                        max={1}
                        value={averageMoodData.liveness}
                      ></progress>
                      <label className="optionSecond">liveness</label>
                    </div>

                    <div className="progresBarElements">
                      <label className="optionFirst">sad</label>
                      <progress
                        className="moods"
                        max={1}
                        value={averageMoodData.valence}
                      ></progress>
                      <label className="optionSecond">happy</label>
                    </div>

                    <div className="progresBarElements">
                      <label className="optionFirst">soft</label>
                      <progress
                        className="moods"
                        min={0}
                        max={60}
                        value={Math.abs(averageMoodData.loudness)}
                      ></progress>
                      <label className="optionSecond">loud</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Player
        accessToken={accessToken}
        trackUri={selectedTrackUri}
        togglePlayer={togglePlayer}
        isPaused={isPaused}
      />
    </div>
  );
};

export default ProfilePage;

// TODO

// top 1 artist, more info about him
//dodaj guzik zamykjący platera
// top 10 genres 2 grid with them

// to mood add obscure and popolarity rating
//dymek na hover
//https://www.npmjs.com/package/@check-light-or-dark/image
//https://lenadesign.org/2021/05/15/css-slide-text-animation-slide-effect/
