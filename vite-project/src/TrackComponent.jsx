import React from "react";

const TrackComponent = ({ track, onSelectTrack }) => {
  const handleImageClick = () => {
    onSelectTrack(track.uri);
  };

  return (
    <div>
      <h2>{track.name}</h2>
      <img src={track.album.images[0]?.url} alt="" onClick={handleImageClick} />
    </div>
  );
};

export default TrackComponent;
