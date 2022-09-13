import React from "react";
import { Modal, makeStyles, IconButton } from "@material-ui/core";
import { baseStyle, borderRadius } from "theme";
import { Document, Page } from "react-pdf";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { FileData } from "types/fileData";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { BasePdf } from "components/BasePdf/BasePdf";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainDataBlobUrl: string;
}

export const PdfModal = ({ isOpen, setIsOpen, mainDataBlobUrl }: Props) => {
  const classes = useStyles();
  const [pdfPagesNum, setPdfPagesNum] = React.useState(0);
  const [pdfCurrentPageNum, setPdfCurrentPageNum] = React.useState(1);

  const handleClickCloseButton = () => {
    setIsOpen(false);
  };

  const handleClickBackIcon = () => {
    if (pdfCurrentPageNum === 1) {
      setPdfCurrentPageNum(pdfPagesNum);
    } else {
      setPdfCurrentPageNum((prev) => prev - 1);
    }
  };

  const handleClickForwardIcon = () => {
    if (pdfCurrentPageNum === pdfPagesNum) {
      setPdfCurrentPageNum(1);
    } else {
      setPdfCurrentPageNum((prev) => prev + 1);
    }
  };

  const PdfPages = [];
  for (let i = 1; i <= pdfPagesNum; i += 1) {
    PdfPages.push(
      <Page
        key={i}
        className={`${classes.pdfPage} ${
          i === pdfCurrentPageNum ? classes.pdfPageDisplayFlex : ""
        }`}
        pageNumber={i}
      />
    );
  }

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
          <HighlightOffIcon className={classes.HighlightOffIcon} />
        </IconButton>
        <BasePdf fileData={fileData} />
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
  pdfButtonArea: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "5px",
    position: "absolute",
    bottom: 0,
  },
  pdfCurrentPageNumArea: {
    color: baseStyle.color.white.light,
  },
  pdfButtonArea: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "5px",
    position: "absolute",
    bottom: 0,
  },
  pdfCurrentPageNumArea: {
    color: baseStyle.color.white.light,
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
  pdfDocument: {
    position: "relative",
    borderRadius: borderRadius.main,
    padding: "10px",
  },
  pdfButtonArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "5px",
  },
  pdfPage: {
    overflow: "hidden",
    width: "100%",
    display: "none",
  },
  pdfPageDisplayFlex: {
    display: "flex",
  },
});
