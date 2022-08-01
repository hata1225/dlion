import { makeStyles, CircularProgress } from "@material-ui/core";
import React from "react";
import { baseStyle, fontSize } from "theme";
import { FileData } from "types/fileData";

type Props = {
  coverImage: string;
  shortVideo?: string;
  videoDataStatus: any;
  fileData: FileData;
};

export const ImageArea = ({
  coverImage,
  shortVideo,
  videoDataStatus,
  fileData,
}: Props) => {
  const classes = useStyles();
  const [isShortVideo, setIsShortVideo] = React.useState(false);
  const [isAllCompleteByEncodeVideo, setIsAllCompleteByEncodeVideo] =
    React.useState<any>();

  React.useEffect(() => {
    if (videoDataStatus) {
      setIsAllCompleteByEncodeVideo(videoDataStatus["allcomplete"] === 1);
    }
  }, [videoDataStatus]);

  const onMouseEnterImage = () => {
    setIsShortVideo(true);
  };

  const onMouseOutImage = () => {
    setIsShortVideo(false);
  };

  return (
    <div className={classes.imageArea}>
      {isAllCompleteByEncodeVideo ? (
        <img
          className={classes.image}
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
            className={`${classes.image} ${classes.imageByNotFocus}`}
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
    </div>
  );
};

const useStyles = makeStyles({
  imageArea: {
    backgroundColor: baseStyle.color.gray.light,
    width: "100%",
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
