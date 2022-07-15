import { Card, makeStyles } from "@material-ui/core";
import React from "react";

interface Props {
  fileData: any;
}

export const FileDataCard = ({ fileData }: Props) => {
  const { user, title, description, created_at, categories, cover_image } =
    fileData;

  const classes = useStyles();

  return (
    <Card className={classes.fileDataCard}>
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
};

const useStyles = makeStyles({
  fileDataCard: { width: "50%" },
});
