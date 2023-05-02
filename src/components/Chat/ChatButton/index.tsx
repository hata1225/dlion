import { Button, makeStyles } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { baseStyle, fontSize } from "theme";

export const ChatButton = () => {
  const classes = useStyles();
  return (
    <Button className={classes.buttonWithIcon} variant="outlined">
      <MailOutlineIcon style={{ fontSize: fontSize.medium.medium }} />
    </Button>
  );
};

const useStyles = makeStyles({
  buttonWithIcon: {
    width: baseStyle.button.width.small,
    minWidth: baseStyle.button.width.small,
  },
});
