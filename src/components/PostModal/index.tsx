import { IconButton, makeStyles, Modal } from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius, fontSize } from "theme";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  isOpenPostModal: boolean;
  setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostModal = (props: Props) => {
  const { isOpenPostModal, setIsOpenPostModal } = props;
  const classes = useStyles();

  const handleClose = () => {
    setIsOpenPostModal(false);
  };

  return (
    <Modal
      className={classes.modal}
      open={isOpenPostModal}
      onClose={handleClose}
    >
      <div className={classes.postArea}>
        <div className={classes.postAreaHeader}>
          <div className={classes.heading}>ファイルを投稿する</div>
          <IconButton className={classes.iconButton} onClick={handleClose}>
            <CloseIcon style={{ fontSize: fontSize.large.small }} />
          </IconButton>
        </div>
        <div className={classes.main}></div>
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
  postArea: {
    height: baseStyle.postModalHeight.pc,
    width: baseStyle.postModalWidth.pc,
    backgroundColor: baseStyle.color.white.light,
    borderRadius: borderRadius.main,
    padding: "10px",
  },
  postAreaHeader: {
    height: baseStyle.postAreaHeader.pc,
    display: "flex",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: fontSize.large.medium,
    fontWeight: "bold",
  },
  iconButton: {
    padding: "6px",
  },
  main: {},
});
