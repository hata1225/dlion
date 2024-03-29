import { IconButton, makeStyles } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { FileData, FileDataStatus } from "types/fileData";
import { UserContext } from "../../contexts/UserContext";
import ReactHlsPlayer from "react-hls-player";
import { DetailPageCard } from "components/DetailPageCard";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import { PdfModal } from "components/PdfModal";
import { BasePdf } from "components/BasePdf";
import { fontSize } from "theme";
import { getFileData, getMainDataByBlob } from "api/api";
import { NotFoundPage } from "pages/NotFoundPage";
import { Layout } from "components/Layout";

export const FileDataDetailPage = () => {
  const [fileData, setFileData] = React.useState<FileData>();
  const [mainDataBlobUrl, setMainDataBlobUrl] = React.useState("");
  const [isOpenByPdfModal, setIsOpenByPdfModal] = React.useState(false);
  const [mainDataType, setMainDataType] = React.useState<
    FileDataStatus | undefined
  >(fileData?.main_data_type);
  const [isNotFoundPage, setIsNotFoundPage] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const { id } = useParams();
  const classes = useStyles();
  const playerRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    (async () => {
      if (fileData && user?.token) {
        setMainDataType(fileData.main_data_type);
        const newMainDataBlobUrl = await getMainDataByBlob(
          fileData,
          user.token
        );
        setMainDataBlobUrl(newMainDataBlobUrl);
      }
    })();
  }, [user?.token, fileData]);

  React.useEffect(() => {
    (async () => {
      if (user?.token && id) {
        try {
          setIsNotFoundPage(false);
          const newFileData = await getFileData(user.token, id);
          setFileData(newFileData);
        } catch (error) {
          setIsNotFoundPage(true);
        }
      }
    })();
  }, [user?.token, id]);

  const handleClickZoomButton = () => {
    setIsOpenByPdfModal(true);
  };

  if (isNotFoundPage) {
    return (
      <Layout>
        <NotFoundPage />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className={classes.fileDataDetailPage}>
          <div className={classes.headingArea}>
            <h2 className={classes.heading}>{fileData?.title}</h2>
          </div>
          {mainDataType === "video" && (
            <ReactHlsPlayer
              src={fileData?.main_data ? fileData.main_data : ""}
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
              <BasePdf
                mainDataBlobUrl={mainDataBlobUrl}
                isBlackByIconButtonColor
              />
              <PdfModal
                isOpen={isOpenByPdfModal}
                setIsOpen={setIsOpenByPdfModal}
                mainDataBlobUrl={mainDataBlobUrl}
              />
            </>
          )}
          <div className={classes.descriptionArea}>
            <p>{fileData?.description}</p>
          </div>
          {fileData && <DetailPageCard fileData={fileData} />}
        </div>
      </Layout>
    );
  }
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
    margin: "100px 0",
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
});
