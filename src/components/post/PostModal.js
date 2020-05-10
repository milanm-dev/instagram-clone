import React from "react";
import Modal from "react-modal";
import { usePostModalStyles } from "../../styles";
import { useHistory, useParams } from "react-router-dom";
import Post from "./Post";
import { CloseIcon } from "../../icons";

function PostModal() {
  const history = useHistory();
  const classes = usePostModalStyles();
  const { postId } = useParams();
  console.log({ postId });

  return (
    <>
      <Modal
        isOpen
        ariaHideApp={false}
        overlayClassName={classes.overlay}
        onRequestClose={() => history.goBack()}
        style={{
          content: {
            display: "flex",
            alignItems: "center",
            maxWidth: 935,
            width: "100%",
            top: "50%",
            left: "50%",
            bottom: "auto",
            right: "auto",
            transform: "translate(-50%, -50%)",
            margin: 0,
            padding: 0,
            overflow: "none",
            WebkitOverflowScrolling: "touch",
          },
        }}
      >
        <Post id={postId} />
      </Modal>
      <div onClick={() => history.goBack()} className={classes.close}>
        <CloseIcon />
      </div>
    </>
  );
}

export default PostModal;
