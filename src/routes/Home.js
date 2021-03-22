import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "../components/Nweet";
import FeedFactory from "components/FeedFactory";

const Home = ({ userObj }) => {
  //Router.js 를 통해 App.js로 부터온 userObj (로그인한 유저 정보)
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    console.log(userObj.photoURL);
    dbService
      .collection("feeds")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        //onSnapshot = DB변화가 있을시 실행 (실시간)  /orderBy("createdAt","desc") = 날짜 내림차순 정렬
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      });
  }, []);

  return (
    <div className="container">
      <FeedFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            userObj={userObj}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
