import React, { useEffect, useState } from "react";

const Top50ArtistsComponent = () => {
  const [top50Artists, setTop50Artists] = useState([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("longArtistsSessionData");

    if (storedData) {
      setTop50Artists(JSON.parse(storedData).items);
    }
  }, []);

  return (
    <div className="top50Tracks">
      {top50Artists.map((artists, index) => (
        <div key={index} className="TopTrackLayout">
          <h3>
            {index + 1} / {artists.name}
          </h3>
          <img className="allImgTrack" src={artists.images[0]?.url} alt="" />
        </div>
      ))}
    </div>
  );
};

export default Top50ArtistsComponent;
