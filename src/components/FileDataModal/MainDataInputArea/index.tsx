import { makeStyles, Button, IconButton } from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius } from "theme";
import { FileDataStatus } from "types/fileData";
import { Document, Page, pdfjs } from "react-pdf";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  mainData: File | undefined;
  mainDataObjectUrl: string;
  handleChangeMainData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mainDataStatus: FileDataStatus;
  mainDataInputAreaWidth: number;
}

export const MainDataInputArea = React.memo(
  ({
    mainData,
    mainDataObjectUrl,
    handleChangeMainData,
    mainDataStatus,
    mainDataInputAreaWidth,
  }: Props) => {
    const classes = useStyles();
    const [pdfPagesNum, setPdfPagesNum] = React.useState(0);
    const [pdfCurrentPageNum, setPdfCurrentPageNum] = React.useState(1);
    const previewAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (mainData) {
        const prevVideoElem = document.getElementById(
          "preview-video"
        ) as HTMLVideoElement | null;
        if (prevVideoElem) {
          prevVideoElem.volume = 0;
        }
      }
      setPdfCurrentPageNum(1);
    }, [mainData]);

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

    const PreviewArea = () => {
      if (mainDataStatus === "video") {
        return (
          <video
            id="preview-video"
            className={classes.previewArea}
            src={mainDataObjectUrl}
            preload="metadata"
            controls
          />
        );
      } else if (mainDataStatus === "image") {
        return (
          <div
            className={classes.previewArea}
            style={{ backgroundImage: `url(${mainDataObjectUrl})` }}
          ></div>
        );
      } else if (mainDataStatus === "audio") {
        return (
          <div className={`${classes.previewArea} ${classes.audioWrap}`}>
            <audio src={mainDataObjectUrl} preload="metadata" controls></audio>
          </div>
        );
      } else if (mainDataStatus === "pdf") {
        return (
          <div
            style={{ height: `${mainDataInputAreaWidth}px` }}
            className={`${classes.previewArea}`}
          >
            <div className={classes.pdfPageCountArea}>
              <p>
                {pdfCurrentPageNum} / {pdfPagesNum}
              </p>
            </div>
            <Document
              className={classes.previewAreaDocument}
              file={mainDataObjectUrl}
              onLoadSuccess={({ numPages }) => {
                setPdfPagesNum(numPages);
              }}
            >
              <Page
                width={mainDataInputAreaWidth}
                pageNumber={pdfCurrentPageNum}
              />
            </Document>
            {pdfPagesNum !== 1 ? (
              <div className={classes.pdfPreviewAreaButtonArea}>
                <IconButton onClick={handleClickBackIcon}>
                  <ArrowBackIcon />
                </IconButton>
                <IconButton>
                  <ArrowForwardIcon onClick={handleClickForwardIcon} />
                </IconButton>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      } else if (mainDataStatus === "none") {
        return <div className={`${classes.previewArea}`}></div>;
      } else {
        return <>{mainDataStatus} cannnot be upload.</>;
      }
    };

    return (
      <div
        id="mainDataInputArea"
        className={classes.mainDataInputArea}
        ref={previewAreaRef}
      >
        <PreviewArea />
        <Button variant="contained" color="primary" component="label" fullWidth>
          データを{mainData ? "変更" : "追加"}する
          <input
            style={{ display: "none" }}
            type="file"
            accept="video/*,image/*,audio/*,.pdf"
            onChange={(e) => handleChangeMainData(e)}
            onClick={(e: any) => {
              e.target.value = "";
            }}
          />
        </Button>
      </div>
    );
  }
);

const useStyles = makeStyles({
  mainDataInputArea: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    justifyContent: "space-between"
  },
  audioWrap: {
    display: "flex",
    alignItems: "center",
    aspectRatio: "unset !important",
    backgroundColor: "#fff !important",
  },
  previewArea: {
    position: "relative",
    height: "100%",
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: baseStyle.color.gray.main,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: borderRadius.main,
    verticalAlign: "bottom",
    overflow: "hidden",
  },
  pdfPageCountArea: {
    position: "absolute",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingTop: "10px",
    zIndex: 10,
  },
  previewAreaDocument: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pdfPreviewAreaButtonArea: {
    position: "absolute",
    bottom: "5px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
});
