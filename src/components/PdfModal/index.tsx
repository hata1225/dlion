import React from "react";
import { Modal, makeStyles, IconButton } from "@material-ui/core";
import { baseStyle, borderRadius } from "theme";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { BasePdf } from "components/BasePdf";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainDataBlobUrl: string;
}

export const PdfModal = ({ isOpen, setIsOpen, mainDataBlobUrl }: Props) => {
  const classes = useStyles();

  const handleClicCloseButton = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className={classes.pdfModalContentArea}>
        <IconButton
          className={`${classes.pdfModalCloseButton} ${classes.iconButtonWhiteColorHover}`}
          onClick={handleClicCloseButton}
        >
          <HighlightOffIcon
            className={`${classes.HighlightOffIcon} ${classes.iconButtonWhiteColor}`}
          />
        </IconButton>
        <BasePdf mainDataBlobUrl={mainDataBlobUrl} />
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
  pdfModalContentArea: {
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
  pdfModalCloseButton: {
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
