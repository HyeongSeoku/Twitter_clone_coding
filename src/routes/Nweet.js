import React from "react";

const Nweet = ({ nweetObj }) => (
  <div>
    <h4>{nweetObj.text}</h4>
    <button>Delete Nweet</button>
    <button>Edite Nweet</button>
  </div>
);

export default Nweet;