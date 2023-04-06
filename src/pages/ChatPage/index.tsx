import { makeStyles } from "@material-ui/core";
import { FollowListArea } from "../../components/Chat/FollowListArea/index";
import { baseStyle } from "theme";

export const ChatPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.chatPage}>
      <FollowListArea />
    </div>
  );
};

const useStyles = makeStyles({
  chatPage: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: baseStyle.pageLayoutInnerTop.main,
  },
});
