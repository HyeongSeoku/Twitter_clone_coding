import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
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
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
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
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl &&
            <img src={nweetObj.attachmentUrl} />
          }
          {isOwner && (
            <div className="feed__actions">
              <span onClick={onDeleteClick}>Delete Nweet
                <FontAwesomeIcon icon={faTrash}/>
              </span>
              <span onClick={toggleEditing}>Edite Nweet
                <FontAwesomeIcon icon={faPencilAlt}/>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
