import React from "react";
import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import {
  MoreIcon,
  CommentIcon,
  ShareIcon,
  LikeIcon,
  UnlikeIcon,
  RemoveIcon,
  SaveIcon,
} from "../../icons";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Hidden,
  Divider,
  TextField,
  Avatar,
} from "@material-ui/core";
import OptionsDialog from "../shared/OptionsDialog";
// import { defaultPost } from "../../data";
import PostSkeleton from "./PostSkeleton";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/subscriptions";
import { UserContext } from "../../App";
import {
  LIKE_POST,
  UNLIKE_POST,
  SAVE_POST,
  UNSAVE_POST,
} from "../../graphql/mutations";

function Post({ postId }) {
  const classes = usePostStyles();
  const variables = { postId };
  const { data, loading } = useSubscription(GET_POST, { variables });
  const [showOptionsDialog, setOptionsDialog] = React.useState(false);

  if (loading) return <PostSkeleton />;
  const {
    id,
    media,
    likes,
    likes_aggregate,
    user,
    saved_posts,
    user_id,
    location,
    caption,
    comments,
    created_at,
  } = data.posts_by_pk;

  const likesCount = likes_aggregate.aggregate.count;

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        {/* Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} location={location} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setOptionsDialog(true)}
          />
        </div>
        {/*  Post Image */}
        <div className={classes.postImage}>
          <img src={media} alt="post media" className={classes.image} />
        </div>
        {/*  Post buttons */}
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeButton likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton savedPosts={saved_posts} postId={id} />
          </div>
          <Typography className={classes.likes} variant="subtitle2">
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>
          <div
            style={{
              overflowY: "scroll",
              padding: "16px 12px",
              height: "100%",
            }}
          >
            <AuthorCaption
              user={user}
              createdAt={created_at}
              caption={caption}
            />
            {comments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </div>
          <Typography color="textSecondary" className={classes.datePosted}>
            5 DAYS AGO
          </Typography>
          <Hidden xsDown>
            <div className={classes.comment}>
              <Divider />
              <Comment />
            </div>
          </Hidden>
        </div>
      </article>
      {showOptionsDialog && (
        <OptionsDialog onClose={() => setOptionsDialog(false)} />
      )}
    </div>
  );
}

function AuthorCaption({ user, caption, createdAt }) {
  const classes = usePostStyles();
  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={user.profile_image}
        alt="user avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            style={{ paddingLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </Link>
        <Typography
          style={{ margintTop: 16, marginBottom: 4, display: "inline-block" }}
          variant="caption"
          color="textSecondary"
        >
          {createdAt}
        </Typography>
      </div>
    </div>
  );
}

function UserComment({ comment }) {
  const classes = usePostStyles();

  return (
    <div style={{ display: "flex" }}>
      <Avatar
        src={comment.user.profile_image}
        alt="user avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={comment.user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {comment.user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            style={{ paddingLeft: 0 }}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography
          style={{ margintTop: 16, marginBottom: 4, display: "inline-block" }}
          variant="caption"
          color="textSecondary"
        >
          {comment.created_at}
        </Typography>
      </div>
    </div>
  );
}

function LikeButton({ likes, authorId, postId }) {
  const { currentUserId } = React.useContext(UserContext);
  const classes = usePostStyles();
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = React.useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    // profileId: authorId
  };

  function handleLike() {
    // console.log("like");
    setLiked(true);
    likePost({ variables });
  }

  function handleUnlike() {
    // console.log("unlike");
    setLiked(false);
    unlikePost({ variables });
  }

  return <Icon onClick={onClick} className={className} />;
}

function SaveButton({ savedPosts, postId }) {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );
  const [saved, setSaved] = React.useState(isAlreadySaved);
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId,
  };
  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ? handleRemove : handleSave;

  function handleSave() {
    // console.log("saved");
    setSaved(true);
    savePost({ variables });
  }

  function handleRemove() {
    // console.log("removed");
    setSaved(false);
    unsavePost({ variables });
  }

  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

function Comment() {
  const classes = usePostStyles();
  const [content, setContent] = React.useState("");

  return (
    <div className={classes.commentContainer}>
      <TextField
        className={classes.textField}
        fullWidth
        value={content}
        placeholder="Add a comment"
        miltiline="true"
        rowmax={2}
        rows={1}
        onChange={(event) => setContent(event.target.value)}
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline,
          },
        }}
      />

      <Button
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
      >
        Post
      </Button>
    </div>
  );
}

export default Post;

// 4
