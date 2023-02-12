import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { createFriendShip } from "api/api";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { baseStyle } from "theme";

interface Props {
  userId: string;
}

export const FollowButton = ({ userId }: Props) => {
  const classes = useStyles();
  const [isFollowed, setIsFollowed] = React.useState(false);
  const { user } = React.useContext(UserContext);

  const follow = async () => {
    if (user?.token) {
      await createFriendShip(user?.token, userId);
      setIsFollowed(true);
    }
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
