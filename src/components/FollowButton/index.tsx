import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { followUser, unfollowUser } from "api/api";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { baseStyle } from "theme";

interface Props {
  userId: string;
}

export const FollowButton = ({ userId }: Props) => {
  const classes = useStyles();
  // すでにフォローをしている場合はtrue, フォローをしていない場合はfalseとする
  const [isFollowing, setIsFollowing] = React.useState(false);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    const userFollowing = user.following;
    userFollowing.find((user) => {
      if (user.id === userId) {
        setIsFollowing(true);
      }
    });
  }, [user.following, userId]);

  const follow = async () => {
    await followUser(user.token, userId);
    setIsFollowing(true);
  };

  const unFollow = async () => {
    await unfollowUser(user.token, userId);
    setIsFollowing(false);
  };

  return (
    <>
      {isFollowing ? (
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
