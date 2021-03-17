import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      //onAuthStateChanged() =>
      if (user) {
        setUserObj({
          displayName:user.displayName,
          uid:user.uid,
          photoURL:user.photoURL,
          updateProfile:(args)=>user.updateProfile(args),
        });
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName:user.displayName,
      uid:user.uid,
      photoURL:user.photoURL,
      updateProfile:(args)=>user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing...."
      )}
    </>
  );
}

export default App;
