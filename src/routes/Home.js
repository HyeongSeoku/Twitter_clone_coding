import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "./Nweet";

const Home = ({ userObj }) => {
  //Router.js 를 통해 App.js로 부터온 userObj (로그인한 유저 정보)
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
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
  const onSubmit = async (event) => {
    //collection("nweets").add({})의 add가 promise를 리턴하기때문에 async 사용
    event.preventDefault();
    dbService.collection("feeds").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet(""); //submit하고 나선 다시 빈 입력창
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0] ;    //파일
    const reader = new FileReader();  //reader 생성
    reader.onloadend=(finishedEvent)=>{
      console.log(finishedEvent);
    }
    reader.readAsDataURL(theFile);    //readAsDataURL을 이용해서 파일(theFile) 읽음
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
