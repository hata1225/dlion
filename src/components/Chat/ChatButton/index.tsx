import { Button, makeStyles } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import React from "react";
import { baseStyle, fontSize } from "theme";

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = ButtonProps;

export const ChatButton = ({ ...props }: Props) => {
  const classes = useStyles();
  return (
    <Button className={classes.buttonWithIcon} variant="outlined" {...props}>
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
