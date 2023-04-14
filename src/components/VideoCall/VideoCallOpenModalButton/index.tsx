import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import { baseStyle, fontSize } from "theme";
import { VideoCallModalContext } from "contexts/VideoCallModalContext";

export const VideoCallOpenModalButton = () => {
  const classes = useStyles();
  const { handleOpenVideoCallModal } = React.useContext(VideoCallModalContext);

  return (
    <Button
      className={classes.buttonWithIcon}
      variant="outlined"
      onClick={handleOpenVideoCallModal}
    >
      <CallIcon style={{ fontSize: fontSize.medium.medium }} />
    </Button>
  );
};

const useStyles = makeStyles({
  buttonWithIcon: {
    width: baseStyle.button.width.small,
    minWidth: baseStyle.button.width.small,
  },
});
