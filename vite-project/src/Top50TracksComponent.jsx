import React, { useEffect, useState } from "react";

const Top50TracksComponent = () => {
  const [top50Tracks, setTop50Tracks] = useState([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("tracksSessionData2long_term");

    if (storedData) {
      setTop50Tracks(JSON.parse(storedData).items);
    }
  }, []);

  return (
    <div className="top50Tracks">
      {top50Tracks.map((track, index) => (
        <div key={index} className="TopTrackLayout">
          <h3>
            {index + 1} / {track.name}
          </h3>
          <img
            className="allImgTrack"
            src={track.album.images[1]?.url}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};

export default Top50TracksComponent;
