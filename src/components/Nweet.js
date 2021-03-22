import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner , userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`feeds/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async(event) => {
    event.preventDefault();
    console.log(nweetObj , newNweet);
    await dbService.doc(`feeds/${nweetObj.id}`).update({
        text:newNweet,
        updatedAt:Date.now(),
        creatorName:userObj.displayName,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const createdTime = new Date(nweetObj.createdAt);
  return (
    <div className="feed">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container feedEdit">
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
              className="formInput"
            />
          <input type="submit" value="Update" className="formBtn"/>
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
        </>
      ) : (
        <>
        <div className="feed_container">
          <img src={nweetObj.creatorProfileImg} className="feed_userProfile_Img"/>
          <span className="feed_userName">{nweetObj.creatorName}</span>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl &&
            <img src={nweetObj.attachmentUrl} className="feed_UploadImage" />
          }
          {isOwner && (
            <div className="feed__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash}/>
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt}/>
              </span>
            </div>
          )}
          <span className="feed_createdTime">{createdTime.getDate()+
          "/"+(createdTime.getMonth()+1)+
          "/"+createdTime.getFullYear()+
          " "+createdTime.getHours()+
          ":"+createdTime.getMinutes()}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Nweet;
