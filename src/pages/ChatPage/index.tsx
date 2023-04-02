import { makeStyles } from "@material-ui/core";

export const ChatPage = () => {
  const classes = useStyles();

  return <div className={classes.chatPage}></div>;
};

const useStyles = makeStyles({
  chatPage: {},
});
