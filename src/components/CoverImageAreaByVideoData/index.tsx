import { makeStyles, CircularProgress } from "@material-ui/core";
import { useWSFileData } from "dataService/fileData";
import React from "react";
import { baseStyle, fontSize } from "theme";
import { FileData, VideoEncodeStatus } from "types/fileData";

type Props = {
  className?: string;
  classNameByImage?: string;
  propFileData?: FileData;
  isNotTransitionPage?: boolean;
};

export const CoverImageAreaByVideoData = ({
  className,
  classNameByImage,
  propFileData,
  isNotTransitionPage,
}: Props) => {
  const classes = useStyles();
  const [isShortVideo, setIsShortVideo] = React.useState(false);
  const [coverImage, setCoverImage] = React.useState("");
  const [shortVideo, setShortVideo] = React.useState("");
  const [videoEncodeStatus, setVideoEncodeStatus] =
    React.useState<VideoEncodeStatus>();
  const [isVideoType, setIsVideoType] = React.useState(false); // 動画タイプならtrue
  const [isVideoEncoded, setIsVideoEncoded] = React.useState(true);
  const [videoEncodeProgress, setVideoEncodeProgress] = React.useState(0);
  const { fileData } = useWSFileData(propFileData?.id);

  // エンコード状況,カバー画像,ショートビデオの取得
  React.useEffect(() => {
    if (propFileData) {
      const {
        video_encode_status,
        cover_image,
        short_video_path,
        main_data_type,
      } = propFileData;
      setVideoEncodeStatus(video_encode_status);
      setCoverImage(cover_image ?? "");
      setShortVideo(short_video_path);
      setIsVideoType(main_data_type === "video");
      setIsVideoEncoded(video_encode_status === "encoded");
    }
  }, [propFileData]);

  React.useEffect(() => {
    if (fileData) {
      const { video_encode_status, cover_image, short_video_path } = fileData;
      setVideoEncodeStatus(video_encode_status);
      setCoverImage(cover_image ?? "");
      if (video_encode_status === "encoded") {
        setIsVideoEncoded(true);
        setShortVideo(short_video_path);
      }
    }
  }, [fileData]);

  React.useEffect(() => {
    if (videoEncodeStatus === "not_encoded") {
      setVideoEncodeProgress(0);
    } else if (videoEncodeStatus === "m3u8") {
      setVideoEncodeProgress(1);
    } else if (videoEncodeStatus === "short") {
      setVideoEncodeProgress(2);
    } else if (videoEncodeStatus === "encoded") {
      setVideoEncodeProgress(3);
    }
  }, [videoEncodeStatus]);

  const handleClickImage = () => {
    if (!isVideoType && propFileData) {
      window.location.href = `/filedata/${propFileData.id}`;
    } else if (isVideoEncoded && propFileData && !isNotTransitionPage) {
      window.location.href = `/filedata/${propFileData.id}`;
    }
  };

  const onMouseEnterImage = () => {
    if (isVideoType) {
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
          {!isVideoType || isVideoEncoded ? (
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
                  {videoEncodeProgress}
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
