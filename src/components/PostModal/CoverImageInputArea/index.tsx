import { makeStyles, Button } from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius } from "theme";

interface Props {
  coverImage?: File;
  coverImageObjectUrl: string;
  handleChangeCoverImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CoverImageInputArea = React.memo(
  ({ coverImage, coverImageObjectUrl, handleChangeCoverImage }: Props) => {
    const classes = useStyles();
    return (
      <div className={classes.coverImageInputArea}>
        <div
          className={classes.previewArea}
          style={{ backgroundImage: `url(${coverImageObjectUrl})` }}
        ></div>
        <Button variant="contained" color="primary" component="label" fullWidth>
          カバー画像を{coverImage ? "変更" : "追加"}する
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleChangeCoverImage}
          />
        </Button>
      </div>
    );
  }
);

const useStyles = makeStyles({
  coverImageInputArea: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  previewArea: {
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: baseStyle.color.gray.main,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: borderRadius.main,
  },
});
