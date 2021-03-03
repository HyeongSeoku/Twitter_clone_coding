import React, { useState } from "react";
import {dbService} from "fbase";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const onSubmit = async (event) => {   //collection("nweets").add({})의 add가 promise를 리턴하기때문에 async 사용
    event.preventDefault();
    dbService.collection("nweets").add({    
      nweet:nweet,
      createdAt:Date.now(),
    });
    setNweet("");   //submit하고 나선 다시 빈 입력창
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
    </div>
  );
};

export default Home;
