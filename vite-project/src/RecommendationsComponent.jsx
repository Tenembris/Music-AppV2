import React, { useState, useEffect } from "react";
import axios from "axios";

const RecommendationsComponent = ({ onRecommendationClick }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTempo, setSelectedTempo] = useState([]);
  const [selectedMood, setSelectedMood] = useState([]);
  const [selectedArtists, setSelectedArtistId] = useState([]);
  const [selectedTracks, setSelectedTrackId] = useState([]);
  const [generatedRecommendations, setGeneratedRecommendations] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const [genreButtonsDisabled, setGenreButtonsDisabled] = useState(false);
  const [tempoButtonsDisabled, setTempoButtonsDisabled] = useState(false);
  const [moodButtonsDisabled, setMoodButtonsDisabled] = useState(false);
  //   const [selectedArtists, setSelectedArtists] = useState([]);
  const [artistButtonsDisabled, setArtistButtonsDisabled] = useState(false);
  const [trackButtonsDisabled, setTrackButtonsDisabled] = useState(false);

  const handleGenreClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      // If genre is already selected, remove it
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      // If genre is not selected, add it
      setSelectedGenres([...selectedGenres, genre]);
    }

    // Toggle the disabled status of genre buttons
    setGenreButtonsDisabled(!genreButtonsDisabled);
  };
  const handleTempoClick = (tempo) => {
    if (selectedTempo.includes(tempo)) {
      // If tempo is already selected, remove it
      setSelectedTempo(selectedTempo.filter((t) => t !== tempo));
    } else {
      // If tempo is not selected, add it
      setSelectedTempo([...selectedTempo, tempo]);
    }

    // Toggle the disabled state of tempo buttons
    setTempoButtonsDisabled((prevState) => !prevState);
  };
  const moodRange = {
    sad: { min: 0.1, max: 0.3 },
    mid: { min: 0.31, max: 0.6 },
    happy: { min: 0.61, max: 0.99 },
    whatever: { min: 0, max: 1 },
  };

  const [minValence, setMinValence] = useState();
  const [maxValence, setMaxValence] = useState();

  const handleMoodClick = (mood) => {
    const { min, max } = moodRange[mood];

    if (minValence === min && maxValence === max) {
      // If the same mood is clicked again, reset min and max values
      setMinValence();
      setMaxValence();
      setSelectedMood([]);
      setMoodButtonsDisabled(false); // Enable all mood buttons
    } else {
      // Update min and max values
      setMinValence(min);
      setMaxValence(max);
      setSelectedMood([{ name: mood }]);
      setMoodButtonsDisabled(true); // Disable all mood buttons
    }
  };

  const generateRecommendations = async () => {
    const artistIds = selectedArtists.join(",");
    const trackIds = selectedTracks.join(",");
    setGenreButtonsDisabled(true);
    setTempoButtonsDisabled(true);
    setMoodButtonsDisabled(true);

    const recommendationURL = `https://api.spotify.com/v1/recommendations?seed_genres=${selectedGenres.join(
      ","
    )}&target_tempo=${selectedTempo}&min_valence=${minValence}&max_valence=${maxValence}&seed_artists=${artistIds}&seed_tracks=${trackIds}`;

    try {
      const response = await axios.get(recommendationURL, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      setGeneratedRecommendations(response.data.tracks);
      sessionStorage.setItem(
        "generatedRecommendations",
        JSON.stringify(response.data.tracks)
      );

      setSelectedGenres([]);
      setSelectedTempo([]);
      setSelectedMood([]);
      setSelectedArtistId([]);
      setSelectedTrackId([]);
      setMaxValence([]);
      setMinValence([]);

      console.log(recommendationURL);
    } catch (error) {
      console.error(error);
    }

    setGenreButtonsDisabled(false);
    setTempoButtonsDisabled(false);
    setMoodButtonsDisabled(false);
  };

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
        console.error(error);
      }
    }
  };

  const longArtistsSessionData = JSON.parse(
    sessionStorage.getItem("longArtistsSessionData")
  );

  const handleArtistClick = (artistId) => {
    const isArtistSelected = selectedArtists.includes(artistId);

    if (isArtistSelected) {
      setSelectedArtistId(selectedArtists.filter((id) => id !== artistId));
    } else {
      if (selectedArtists.length < 2) {
        setSelectedArtistId([...selectedArtists, artistId]);
      }
    }
  };

  const longTermTracksSessionData = JSON.parse(
    sessionStorage.getItem("tracksSessionData2long_term")
  );

  const handleTrackClick = (trackId) => {
    const isTrackSelected = selectedTracks.includes(trackId);

    if (isTrackSelected) {
      setSelectedTrackId(selectedTracks.filter((id) => id !== trackId));
    } else {
      if (selectedTracks.length < 2) {
        setSelectedTrackId([...selectedTracks, trackId]);
      }
    }
  };

  const generatedRecommendationsData = JSON.parse(
    sessionStorage.getItem("generatedRecommendations")
  );

  return (
    <div className="Recommendations-Page">
      <div className="recomendations-options">
        <h1>Custom Your Recomendations!</h1>
        <div className="recommendationContainer">
          <div>
            <h2>Choose Genres</h2>
            <div className="genre-container">
              <button
                className="genre-button"
                onClick={() => handleGenreClick("rock")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("rock")
                }
              >
                Rock
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("gym%20hardstyle")}
                disabled={
                  genreButtonsDisabled &&
                  !selectedGenres.includes("gym%20hardstyle")
                }
              >
                Hardstyle
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("pop")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("pop")
                }
              >
                Pop
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("rap")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("rap")
                }
              >
                Rap
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("chill")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("chill")
                }
              >
                Chill
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("idm")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("idm")
                }
              >
                IDM
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("metal")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("metal")
                }
              >
                Metal
              </button>
              <button
                className="genre-button"
                onClick={() => handleGenreClick("country")}
                disabled={
                  genreButtonsDisabled && !selectedGenres.includes("country")
                }
              >
                Country
              </button>
            </div>
          </div>

          <div>
            <h2>Choose Tempo</h2>
            <div className="tempo-container">
              <button
                onClick={() => handleTempoClick(80)}
                disabled={tempoButtonsDisabled && selectedTempo.includes(60)}
              >
                slow/Largo largo 40-60 BPM
              </button>
              <button
                onClick={() => handleTempoClick(80)}
                disabled={tempoButtonsDisabled && selectedTempo.includes(80)}
              >
                peacful/Andante 76-108 BPM
              </button>
              <button
                onClick={() => handleTempoClick(140)}
                disabled={tempoButtonsDisabled && selectedTempo.includes(140)}
              >
                moderate/moderately 108-120 BPM
              </button>
              <button
                onClick={() => handleTempoClick(140)}
                disabled={tempoButtonsDisabled && selectedTempo.includes(140)}
              >
                fast Allegro 120-168 BPM
              </button>
              <button
                onClick={() => handleTempoClick(140)}
                disabled={tempoButtonsDisabled && selectedTempo.includes(140)}
              >
                presto very fast 168-200 BPM
              </button>
            </div>
          </div>

          <div>
            <h2>Choose Mood</h2>
            <div className="tempo-container">
              {Object.keys(moodRange).map((mood) => (
                <button
                  className="mood-button"
                  key={mood}
                  onClick={() => handleMoodClick(mood)}
                  disabled={
                    moodButtonsDisabled &&
                    selectedMood.length > 0 &&
                    selectedMood[0].name !== mood
                  }
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2>Top Artists</h2>
          <div className="top10Tracks">
            <div className="TracksWrapper RecommenedTrackWrapper">
              {[0, 1, 2, 3].map((columnIndex) => (
                <div key={columnIndex} className="TrackColumn">
                  {longArtistsSessionData.items
                    .slice(columnIndex * 4, columnIndex * 4 + 4)
                    .map((artist, index) => (
                      <div key={index} className="TopElements">
                        <h3>
                          {index + 1 + columnIndex * 4} / {artist.name}
                        </h3>
                        <img
                          src={artist.images[1].url}
                          alt={artist.name}
                          onClick={() => handleArtistClick(artist.id)}
                          disabled={
                            selectedArtists.length === 2 &&
                            !selectedArtists.includes(artist.id)
                          }
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="DataForRecommendations">
          <h2>Top Tracks</h2>
          <div className="top10Tracks">
            <div className="TracksWrapper RecommenedTrackWrapper">
              {[0, 1, 2, 3].map((columnIndex) => (
                <div key={columnIndex} className="TrackColumn">
                  {longTermTracksSessionData.items
                    .slice(columnIndex * 4, columnIndex * 4 + 4)
                    .map((track, index) => (
                      <div key={index} className="TopElements">
                        <h3>
                          {index + 1 + columnIndex * 4} / {track.name}
                        </h3>
                        <img
                          src={track.album.images[1].url}
                          alt={track.name}
                          onClick={() => handleTrackClick(track.id)}
                          disabled={
                            selectedTracks.length === 2 &&
                            !selectedTracks.includes(track.id)
                          }
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateRecommendations}
          className="generate-recommendatonButton"
        >
          Generate Recommendations
        </button>
      </div>
      {generatedRecommendationsData && (
        <div>
          <div>
            <h2>Generated Recommendations</h2>
          </div>
          <div className="GeneratedRecommendations">
            {generatedRecommendationsData.map((track, index) => (
              <div
                key={index}
                className="RecommendationElement"
                style={{
                  backgroundImage: `url(${track.album.images[2].url})`,
                  backgroundSize: "cover", // Adjust as needed
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onClick={() => {
                  onRecommendationClick(track.uri); // Call the callback
                }}
              >
                <div className="RecommendationElementGlassMorph">
                  {/* You can keep or remove the img tag depending on your needs */}
                  <div>
                    <img src={track.album.images[1].url} alt={track.name} />
                  </div>
                  <div>
                    <h3>{track.name}</h3>
                    <p>
                      Artists:{" "}
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsComponent;
