import React, { useEffect, useState } from "react";
import { dbService } from "fbase";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObject, ...prev]); //[current document data , 이전 데이터] 이전 데이터 들을 붙여씀
    });
  };
  useEffect(() => {
    getNweets();
  }, []);
  const onSubmit = async (event) => {
    //collection("nweets").add({})의 add가 promise를 리턴하기때문에 async 사용
    event.preventDefault();
    dbService.collection("nweets").add({
      nweet: nweet,
      createdAt: Date.now(),
    });
    setNweet(""); //submit하고 나선 다시 빈 입력창
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
      <div key={nweet.id}>
        {nweets.map((nweet) => (
          <div>
            <h3>{nweet.nweet}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
