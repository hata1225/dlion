import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";

interface Props {
  isMarginVertical?: boolean;
}

export const PostModalLine = ({ isMarginVertical }: Props) => {
  const classes = useStyles();
  return (
    <div
      className={classes.postModalLine}
      style={{
        marginTop: isMarginVertical ? "10px" : "0",
        marginBottom: isMarginVertical ? "10px" : "0",
      }}
    ></div>
  );
};

const useStyles = makeStyles({
  postModalLine: {
    minHeight: "1px",
    width: "100%",
    backgroundColor: baseStyle.color.gray.main,
  },
});
