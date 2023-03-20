import { makeStyles, CircularProgress } from "@material-ui/core";
import { getFileData } from "api/api";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { baseStyle, fontSize } from "theme";
import { FileData } from "types/fileData";

type Props = {
  className?: string;
  classNameByImage?: string;
  fileData?: FileData;
  isNotTransitionPage?: boolean;
};

export const CoverImageAreaByVideoData = ({
  className,
  classNameByImage,
  fileData,
  isNotTransitionPage,
}: Props) => {
  const classes = useStyles();
  const [isShortVideo, setIsShortVideo] = React.useState(false);
  const [videoDataStatus, setVideoDataStatus] = React.useState<any>();
  const [coverImage, setCoverImage] = React.useState(fileData?.cover_image);
  const [isVideoTypeByFileData, setIsVideoTypeByFileData] = React.useState(
    fileData?.main_data_type === "video"
  );
  const [shortVideo, setShortVideo] = React.useState(
    fileData?.short_video_path
  );
  const [isAllCompleteByEncodeVideo, setIsAllCompleteByEncodeVideo] =
    React.useState<any>();
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    setIsVideoTypeByFileData(fileData?.main_data_type === "video");
  }, [fileData]);

  React.useEffect(() => {
    if (fileData) {
      const { video_data_status } = fileData;
      setVideoDataStatus(video_data_status);
      setCoverImage(fileData.cover_image);
      setShortVideo(fileData.short_video_path);
      (async () => {
        // fileDataがvideoタイプかつ、エンコードが終わっていない場合は、fileDataを再取得
        const isFetchedEncodeStatusByVideoData =
          video_data_status["allcomplete"] === 0 &&
          fileData.main_data_type === "video";
        if (isFetchedEncodeStatusByVideoData) {
          const getFileDataInterval = setInterval(async () => {
            if (user?.token) {
              const newFileData = await getFileData(user.token, fileData.id);
              const newVideoDataStatus = newFileData.video_data_status;
              setVideoDataStatus(newVideoDataStatus);
              setCoverImage(newFileData.cover_image);
              if (newVideoDataStatus["allcomplete"] === 1) {
                setShortVideo(newFileData.short_video_path);
                clearInterval(getFileDataInterval);
              }
            }
          }, 2000);
        }
      })();
    }
  }, [fileData, user?.token]);

  React.useEffect(() => {
    if (fileData?.main_data_type !== "video") {
    } else if (videoDataStatus) {
      setIsAllCompleteByEncodeVideo(videoDataStatus["allcomplete"] === 1);
    }
  }, [videoDataStatus, fileData?.main_data_type]);

  const handleClickImage = () => {
    if (!isVideoTypeByFileData && fileData) {
      window.location.href = `/filedata/${fileData.id}`;
    } else if (isAllCompleteByEncodeVideo && fileData && !isNotTransitionPage) {
      window.location.href = `/filedata/${fileData.id}`;
    }
  };

  const onMouseEnterImage = () => {
    if (isVideoTypeByFileData) {
      setIsShortVideo(true);
    }
  };

  const onMouseOutImage = () => {
    setIsShortVideo(false);
  };

  return (
    <div
      style={{ cursor: isNotTransitionPage ? "default" : "pointer" }}
      className={`${classes.imageArea} ${className}`}
      onClick={handleClickImage}
    >
      {fileData ? (
        <>
          {!isVideoTypeByFileData || isAllCompleteByEncodeVideo ? (
            <img
              className={`${classes.image} ${classNameByImage}`}
              src={isShortVideo ? shortVideo : coverImage}
              alt={fileData.title}
              onMouseEnter={onMouseEnterImage}
              onTouchStart={onMouseEnterImage}
              onMouseOut={onMouseOutImage}
              onTouchEnd={onMouseOutImage}
            />
          ) : (
            <>
              <img
                className={`${classes.image} ${classes.imageByNotFocus} ${classNameByImage}`}
                src={coverImage}
                alt={fileData.title}
              />
              <div className={classes.circularProgressArea}>
                <CircularProgress className={classes.circularProgress} />
                <p className={classes.circularProgressText}>
                  動画変換中(
                  {videoDataStatus ? videoDataStatus["completetotal"] : 0}
                  /2)
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  imageArea: {
    backgroundColor: baseStyle.color.gray.light,
    width: "100%",
    height: "100%",
    aspectRatio: "16 / 9",
    zIndex: 1,
    cursor: "pointer",
    position: "relative",
  },
  imageByNotFocus: {
    cursor: "default",
    filter: "blur(3px) brightness(55%)",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    verticalAlign: "bottom",
  },
  circularProgressArea: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: "10px",
  },
  circularProgress: {
    color: baseStyle.color.white.light,
    fontSize: fontSize.medium.small,
    width: `calc(${fontSize.medium.small} + 0.4rem) !important`,
    height: `calc(${fontSize.medium.small} + 0.4rem) !important`,
  },
  circularProgressText: {
    fontSize: fontSize.medium.small,
    color: baseStyle.color.white.light,
  },
});
