import { makeStyles } from "@material-ui/core";
import { FileDataCard } from "components/FileDataCard";
import { FileDataContext } from "contexts/FileDataContexts";
import { useWindowSize } from "hooks/useWindowSize";
import React from "react";
import { baseStyle } from "theme";

export const MainPage = () => {
  const { fileData } = React.useContext(FileDataContext);
  const [fileDataCardWidth, setFileDataCardWidth] = React.useState("100%");
  const [width] = useWindowSize();
  const classes = useStyles();

  React.useEffect(() => {
    let cardRow = 1;
    let fileDataCardExceptByGap = "0px"; // fileDataCardのwidthは、mainpageのgap分を考慮。
    if (width >= baseStyle.maxWidthLayout.pc) {
      cardRow = 3;
      fileDataCardExceptByGap = fileDataCardExceptByGapFunc(cardRow);
    } else if (width >= baseStyle.maxWidthLayout.tb) {
      cardRow = 2;
      fileDataCardExceptByGap = fileDataCardExceptByGapFunc(cardRow);
    }
    setFileDataCardWidth(`calc(100% / ${cardRow} - ${fileDataCardExceptByGap}`);
  }, [width]);

  const fileDataCardExceptByGapFunc = (cardRow: number) => {
    const num = `${baseStyle.mainPageFileDataCardGap.main} * ${
      cardRow - 1
    } / ${cardRow}`;
    return num;
  };

  return (
    <div className={classes.mainPage}>
      {fileData.map((data, i) => (
        <FileDataCard
          style={{ width: fileDataCardWidth }}
          className={classes.fileDataCard}
          fileData={data}
          key={i}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles({
  mainPage: {
    width: "100%",
    padding: "10px 0px 10px 20px",
    display: "flex",
    gap: baseStyle.mainPageFileDataCardGap.main,
    flexWrap: "wrap",
  },
  fileDataCard: {},
});
