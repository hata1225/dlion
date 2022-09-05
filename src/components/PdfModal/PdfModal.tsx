import React from "react";
import { Modal, makeStyles, IconButton } from "@material-ui/core";
import { baseStyle, borderRadius } from "theme";
import { Document, Page } from "react-pdf";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { FileData } from "types/fileData";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileData?: FileData;
}

export const PdfModal = ({ isOpen, setIsOpen, fileData }: Props) => {
  const classes = useStyles();
  const [pdfPagesNum, setPdfPagesNum] = React.useState(0);

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
          className={classes.pdfModalCloseButton}
          onClick={handleClicCloseButton}
        >
          <HighlightOffIcon className={classes.HighlightOffIcon} />
        </IconButton>
        <Document file={fileData?.main_data}>
          <Page pageNumber={pdfPagesNum} />
        </Document>
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
    height: "90vh",
    width: "90vw",
    maxWidth: `${baseStyle.maxWidthLayout.tb}px`,
    backgroundColor: baseStyle.color.black.main,
    borderRadius: borderRadius.main,
  },
  HighlightOffIcon: {
    color: baseStyle.color.white.light,
    fontSize: 25,
  },
  pdfModalCloseButton: {
    position: "absolute",
    right: 0,
    zIndex: 100,
    margin: "15px",
    padding: "8px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
  },
  pdfDocument: {
    position: "relative",
    backgroundColor: baseStyle.color.gray.dark,
    borderRadius: borderRadius.main,
    padding: "10px",
  },
  pdfPage: {
    overflow: "hidden",
    width: "100%",
  },
});
