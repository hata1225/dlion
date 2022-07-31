import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";
import { FileData } from "types/fileData";

type Props = {
  coverImage: string;
  shortVideo?: string;
  fileData: FileData;
};

export const ImageArea = ({ coverImage, shortVideo, fileData }: Props) => {
  const classes = useStyles();
  const [isShortVideo, setIsShortVideo] = React.useState(false);

  const onMouseEnterImage = () => {
    setIsShortVideo(true);
  };

  const onMouseOutImage = () => {
    setIsShortVideo(false);
  };

  return (
    <div className={classes.imageArea}>
      <img
        className={classes.image}
        src={isShortVideo ? shortVideo : coverImage}
        alt={fileData.title}
        onMouseEnter={onMouseEnterImage}
        onTouchStart={onMouseEnterImage}
        onMouseOut={onMouseOutImage}
        onTouchEnd={onMouseOutImage}
      />
    </div>
  );
};

const useStyles = makeStyles({
  imageArea: {
    backgroundColor: baseStyle.color.gray.light,
    width: "100%",
    aspectRatio: "16 / 9",
    zIndex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
  },
});
