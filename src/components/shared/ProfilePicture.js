import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";

function ProfilePicture({
  size,
  image = "https://images.unsplash.com/photo-1589155396701-8d05f6b0fa15?ixlib=rb-1.2.1&auto=format&fit=crop&w=333&q=80",
  isOwner,
}) {
  const classes = useProfilePictureStyles({ size, isOwner });

  return (
    <section className={classes.section}>
      {image ? (
        <div className={classes.wrapper}>
          <img src={image} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
