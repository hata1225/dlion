import { IconButton, makeStyles } from "@material-ui/core";
import { getFileData } from "api/api";
import React from "react";
import { useParams } from "react-router-dom";
import { FileData, FileDataStatus } from "types/fileData";
import { UserContext } from "../../contexts/UserContext";
import ReactHlsPlayer from "react-hls-player";
import { baseStyle, borderRadius, fontSize } from "theme";
import { DetailPageCard } from "components/DetailPageCard";
import { Page } from "react-pdf";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import { PdfModal } from "components/PdfModal/PdfModal";
import { BasePdf } from "components/BasePdf/BasePdf";

interface Props {}

export const FileDataDetailPage = ({}: Props) => {
  const [fileData, setFileData] = React.useState<FileData>();
  const [isOpenByPdfModal, setIsOpenByPdfModal] = React.useState(false);
  const [mainDataType, setMainDataType] = React.useState<
    FileDataStatus | undefined
  >(fileData?.main_data_type);
  const { user } = React.useContext(UserContext);
  const { id } = useParams();
  const classes = useStyles();
  const playerRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (fileData) {
      setMainDataType(fileData.main_data_type);
    }
  }, [fileData]);

  React.useEffect(() => {
    (async () => {
      if (user?.token && id) {
        const newFileData = await getFileData(user.token, Number(id));
        setFileData(newFileData);
      }
    })();
  }, [user?.token, id]);

  React.useEffect(() => {
    console.log("rerendering");
  }, []);

  const handleClickZoomButton = () => {
    setIsOpenByPdfModal(true);
  };

  return (
    <div className={classes.fileDataDetailPage}>
      <div className={classes.headingArea}>
        <h2 className={classes.heading}>{fileData?.title}</h2>
      </div>
      {mainDataType === "video" && (
        <ReactHlsPlayer
          src={fileData ? fileData.main_data : ""}
          playerRef={playerRef}
          autoPlay={false}
          controls={true}
          width="100%"
          height="auto"
          hlsConfig={{
            maxBufferSize: 30 * 1000 * 1000,
          }}
        />
      )}
      {mainDataType === "audio" && (
        <audio
          className={classes.audio}
          src={fileData ? fileData.main_data : ""}
          preload="metadata"
          controls
        ></audio>
      )}
      {mainDataType === "pdf" && (
        <>
          <div className={classes.zoomButtonArea}>
            <IconButton
              className={classes.zoomButton}
              onClick={handleClickZoomButton}
            >
              <ZoomOutMapIcon />
            </IconButton>
          </div>
          <BasePdf fileData={fileData} />
          <PdfModal
            isOpen={isOpenByPdfModal}
            setIsOpen={setIsOpenByPdfModal}
            fileData={fileData}
          />
        </>
      )}
      <div className={classes.descriptionArea}>
        <p>{fileData?.description}</p>
      </div>
      {fileData ? <DetailPageCard fileData={fileData} /> : <></>}
    </div>
  );
};

const useStyles = makeStyles({
  fileDataDetailPage: {
    position: "relative",
    width: "calc(100% - 150px)",
    aspectRatio: "16 / 9",
    margin: "0 auto 70px auto",
  },
  headingArea: {
    padding: "25px 0",
  },
  heading: {
    fontSize: fontSize.large.large,
  },
  descriptionArea: {
    paddingTop: "10px",
  },
  audio: {
    width: "100%",
  },
  pdfDocument: {
    position: "relative",
    borderRadius: borderRadius.main,
    backgroundColor: baseStyle.color.gray.light,
    padding: "10px",
  },
  zoomButtonArea: {
    position: "absolute",
    margin: "10px",
    zIndex: 10,
    right: 0,
  },
  zoomButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.14)",
    },
  },
  pdfButtonArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "5px",
  },
  pdfPageWrap: {
    height: "100%",
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
