import React from "react";
import { useFeedSideSuggestionsStyles } from "../../styles";
import { Paper, Typography } from "@material-ui/core";
import UserCard from "../shared/UserCard";
import FollowButton from "../shared/FollowButton";
import { LoadingIcon } from "../../icons";
import { useQuery } from "@apollo/react-hooks";
import { SUGGEST_USER } from "../../graphql/queries";
import { UserContext } from "../../App";

function FeedSideSuggestions() {
  const classes = useFeedSideSuggestionsStyles();
  const { me, followersIds } = React.useContext(UserContext);
  const variables = {
    limit: 5,
    followersIds,
    createdAt: me.created_at,
  };
  const { data, loading } = useQuery(SUGGEST_USER, { variables });

  return (
    <article className={classes.article}>
      <Paper className={classes.paper}>
        <Typography
          className={classes.typography}
          variant="subtitle2"
          gutterBottom
          align="left"
          color="textSecondary"
          component="h2"
        >
          Suggestions For You
        </Typography>
        {loading ? (
          <LoadingIcon />
        ) : (
          data.users.map((user) => (
            <div key={user.id} className={classes.card}>
              <UserCard user={user} />
              <FollowButton id={user.id} side />
            </div>
          ))
        )}
      </Paper>
    </article>
  );
}

export default FeedSideSuggestions;
