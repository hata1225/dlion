import { makeStyles } from "@material-ui/core";
import { FileDataCard } from "components/FileDataCard";
import { FileDataContext } from "contexts/FileDataContexts";
import React from "react";

export const MainPage = () => {
  const { fileData } = React.useContext(FileDataContext);
  const classes = useStyles();

  return (
    <div className={classes.mainPage}>
      {fileData.map((data, i) => (
        <FileDataCard fileData={data} key={i} />
      ))}
    </div>
  );
};

const useStyles = makeStyles({
  mainPage: {
    width: "100%",
    height: "100%",
    padding: "10px 10px 10px 20px",
    display: "flex",
    gap: "10px",
  },
});
