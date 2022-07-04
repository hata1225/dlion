import { Button, IconButton, makeStyles, Modal } from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius, fontSize } from "theme";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  isOpenPostModal: boolean;
  setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostModal = (props: Props) => {
  const { isOpenPostModal, setIsOpenPostModal } = props;
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [coverImage, setCoverImage] = React.useState<File>();
  const [videoData, setVideoData] = React.useState<File>();

  const classes = useStyles();

  const handleClose = () => {
    setIsOpenPostModal(false);
  };

  const handlePost = async () => {
    console.log("handlePost");
    console.log("sufileData: ", coverImage);
  };

  const handleChangecoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const coverImage = e.target.files[0];
      setCoverImage(coverImage);
    }
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
        <div className={classes.main}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            fullWidth
          >
            カバー画像を追加
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              onChange={(e) => handleChangecoverImage(e)}
            />
          </Button>
          <Button
            className={classes.postButton}
            variant="contained"
            color="primary"
            onClick={handlePost}
          >
            投稿する
          </Button>
        </div>
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
  postButton: { width: "100%", fontSize: fontSize.medium.small },
});
