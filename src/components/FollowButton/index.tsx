import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { baseStyle } from "theme";

export const FollowButton = () => {
  const classes = useStyles();
  const [isFollowed, setIsFollowed] = React.useState(false);

  const follow = () => {
    setIsFollowed(true);
  };

  const unFollow = () => {
    setIsFollowed(false);
  };

  return (
    <>
      {isFollowed ? (
        <Button
          className={classes.followButton}
          color="primary"
          variant="outlined"
          onClick={unFollow}
        >
          フォロー解除
        </Button>
      ) : (
        <Button
          className={classes.followButton}
          color="primary"
          variant="contained"
          onClick={follow}
        >
          フォローする
        </Button>
      )}
    </>
  );
};

const useStyles = makeStyles({
  followButton: {
    width: baseStyle.button.width.main,
  },
});
