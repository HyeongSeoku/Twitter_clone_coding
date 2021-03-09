import React from "react";

const Nweet = ({ nweetObj, isOwner }) => (
  <div>
    <h4>{nweetObj.text}</h4>
    {isOwner && (
      <>
        <button>Delete Nweet</button>
        <button>Edite Nweet</button>
      </>
    )}
  </div>
);

export default Nweet;
