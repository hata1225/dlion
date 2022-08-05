import { makeStyles } from "@material-ui/core";
import { CoverImageAreaByVideoData } from "components/CoverImageAreaByVideoData";
import React from "react";
import { borderRadius, shadow } from "theme";
import { FileData } from "types/fileData";

interface Props {
  fileData?: FileData;
}

export const DetailPageCard = ({ fileData }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.detailPageCard}>
      <div className={classes.leftArea}>
        <CoverImageAreaByVideoData
          className={classes.coverImageAreaByVideoData}
          classNameByImage={classes.image}
          fileData={fileData}
          isNotTransitionPage
        />
      </div>
      <div className={classes.rightArea}></div>
    </div>
  );
};

const useStyles = makeStyles({
  detailPageCard: {
    marginTop: "20px",
    width: "100%",
    aspectRatio: "7 / 2",
    boxShadow: shadow.main,
    display: "flex",
    borderRadius: borderRadius.main,
  },
  leftArea: {
    width: "100%",
  },
  coverImageAreaByVideoData: {
    borderRadius: borderRadius.main,
  },
  image: {
    borderRadius: borderRadius.main,
  },
  rightArea: {
    width: "100%",
  },
});
