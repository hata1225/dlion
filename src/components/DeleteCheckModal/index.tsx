import { makeStyles, Modal, Button } from "@material-ui/core";
import { deleteFileData } from "api/api";
import { RedButton } from "components/RedButton";
import { UserContext } from "contexts/UserContext";
import { createNotification } from "functions/notification";
import React from "react";
import { baseStyle, borderRadius } from "theme";
import { FileData } from "types/fileData";

interface Props {
  fileData: FileData;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeleteCheckModal = ({
  fileData,
  isOpenModal,
  setIsOpenModal,
}: Props) => {
  const { user } = React.useContext(UserContext);
  const classes = useStyles();

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleClickDeleteButton = async () => {
    if (user?.token) {
      try {
        await deleteFileData(user?.token, fileData.id);
        setTimeout(() => {
          window.location.href = "/";
        }, 300);
      } catch (error) {
        console.log("@handleClickDeleteButton: ", error);
        createNotification("danger", String(error));
        setIsOpenModal(false);
      }
    }
  };

  return (
    <Modal className={classes.modal} open={isOpenModal} onClose={handleClose}>
      <div className={classes.modalContentArea}>
        <h3>"{fileData.title}"を削除しますか？</h3>
        <div className={classes.buttonArea}>
          <Button
            className={classes.button}
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            キャンセル
          </Button>
          <RedButton
            className={classes.button}
            onClick={handleClickDeleteButton}
            variant="contained"
          >
            削除する
          </RedButton>
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
  modalContentArea: {
    backgroundColor: baseStyle.color.white.light,
    borderRadius: borderRadius.main,
    padding: "10px",
    height: "150px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonArea: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  button: {
    width: "90px",
  },
});
