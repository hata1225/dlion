import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { followUser, unfollowUser } from "api/api";
import { UserContext } from "contexts/UserContext";
import { useWSFollowInfo } from "dataService/userData";
import React from "react";
import { baseStyle } from "theme";

interface Props {
  userId: string;
}

/**
 *
 * @userId フォロー,フォロー解除する対象のユーザーID
 * @returns
 */
export const FollowButton = ({ userId }: Props) => {
  const classes = useStyles();
  // すでにフォローをしている場合はtrue, フォローをしていない場合はfalseとする
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState("");
  const { user } = React.useContext(UserContext);
  const { followingList } = useWSFollowInfo(currentUserId);

  React.useEffect(() => {
    let newIsFollowing: boolean = false;
    followingList?.find((user) => {
      if (user.id === userId) {
        newIsFollowing = true;
      }
    });
    setIsFollowing(newIsFollowing);
  }, [followingList]);

  React.useEffect(() => {
    setCurrentUserId(user.id);
  }, [user]);

  const follow = async () => {
    await followUser(user.token, userId);
  };

  const unFollow = async () => {
    await unfollowUser(user.token, userId);
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
