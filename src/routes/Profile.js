import { faPlug, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default ({ userObj,refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profilePhoto, setProfilePhoto] = useState(userObj.photoURL); //사용자의 프로필 사진을 보여주기 위해
  const [newProfilePhoto, setNewProfilePhoto] = useState("");   //파일 선택시 미리보기 위해서
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
    refreshUser()
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const Photo = files[0];
    const reader = new FileReader();
    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewProfilePhoto(result);
    };
    reader.readAsDataURL(Photo);
  };
  const onFileClear = () => {
    setNewProfilePhoto("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let profilePhotoUrl = "";
    if (newProfilePhoto !== "" && newProfilePhoto !== profilePhoto) {
      const profilePhotoRef = storageService
        .ref()
        .child(`${userObj.uid}/${userObj.displayName}/${uuidv4()}`);
      const response = await profilePhotoRef.putString(
        newProfilePhoto,
        "data_url"
      );
      profilePhotoUrl = await response.ref.getDownloadURL();
      setNewProfilePhoto("");
      setProfilePhoto(profilePhotoUrl)
    }
    if (
      userObj.displayName !== newDisplayName ||
      userObj.profilePhoto !== newProfilePhoto
    ) {
      await userObj.updateProfile({
        displayName: newDisplayName,
        photoURL: profilePhoto,
      });
      window.alert("Updated!");
    }
    const profileObj = {
      userName: newDisplayName,
      profilePhotoUrl,
    };
    refreshUser(authService.currentUser.displayName);
  };


  return (
    <div className="container">
      <div className="profile_container">
        <img src={profilePhoto} width="100px" height="100px" className="profilePhoto" />
      <form onSubmit={onSubmit} className="profileForm">
        <input 
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display Name"
          value={newDisplayName}
          className="formInput"
        />
        <>
        <label for="attach-file" className="profileInput__label">
        <span>Fix ProfileImage</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />
          {newProfilePhoto && (
            <div className="preview_container ">
              <span className="profile_load">미리보기</span>
              <img className="profileImg__load" src={newProfilePhoto} width="100px" height="100px" />
              <br></br>
              <button className="fileClearBtn" onClick={onFileClear}>Cancel</button>
            </div>
          )}
        </>
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
          />
      </form>
      </div>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
