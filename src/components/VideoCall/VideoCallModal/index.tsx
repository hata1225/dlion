import React from "react";
import { Modal, makeStyles, IconButton } from "@material-ui/core";
import { baseStyle, borderRadius } from "theme";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { VideoCall } from "../index";

interface Props {
  isOpenVideoCallModal: boolean;
  setIsOpenVideoCallModal: React.Dispatch<React.SetStateAction<boolean>>;
  userIdsByVideoCall: string[];
}

export const VideoCallModal = ({
  isOpenVideoCallModal,
  setIsOpenVideoCallModal,
  userIdsByVideoCall,
}: Props) => {
  const classes = useStyles();

  const handleClicCloseButton = () => {
    setIsOpenVideoCallModal(false);
  };

  return (
    <Modal
      className={classes.modal}
      open={isOpenVideoCallModal}
      onClose={() => setIsOpenVideoCallModal(false)}
    >
      <div className={classes.videoCallModalContent}>
        <IconButton
          className={`${classes.videoCallModalCloseButton} ${classes.iconButtonWhiteColorHover}`}
          onClick={handleClicCloseButton}
        >
          <HighlightOffIcon
            className={`${classes.HighlightOffIcon} ${classes.iconButtonWhiteColor}`}
          />
        </IconButton>
        <VideoCall userIdsByVideoCall={userIdsByVideoCall} />
      </div>
    </Modal>
  );
};

const useStyles = makeStyles({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  videoCallModalContent: {
    position: "relative",
    paddingTop: "15px",
    height: "calc(100vh - 15px)",
    width: "calc(100vw - 30px)",
    maxWidth: `${baseStyle.maxWidthLayout.tb}px`,
    backgroundColor: baseStyle.color.black.main,
    borderRadius: borderRadius.main,
  },
  HighlightOffIcon: {
    fontSize: 25,
  },
  videoCallModalCloseButton: {
    position: "absolute",
    right: 0,
    zIndex: 100,
    marginRight: "15px",
    padding: "8px",
  },
  iconButtonWhiteColor: {
    color: baseStyle.color.white.light,
  },
  iconButtonWhiteColorHover: {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
  },
});
