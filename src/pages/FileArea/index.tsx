import { makeStyles } from "@material-ui/core";
import { FileDataCard } from "components/FileDataCard";
import { FileDataContext } from "contexts/FileDataContexts";
import { useWindowSize } from "hooks/useWindowSize";
import React from "react";
import { baseStyle } from "theme";
import { FileData } from "../../types/fileData";

type Props = {
  reanderedFunc?: () => void;
  isMine?: boolean;
  className?: string;
  userId?: string;
};

export const FileArea = ({
  reanderedFunc,
  isMine,
  className,
  userId,
}: Props) => {
  const { allFileData, mineFileData, fileDataByUserId } =
    React.useContext(FileDataContext);
  const [fileDataCardWidth, setFileDataCardWidth] = React.useState("100%");
  const [fileData, setFileData] = React.useState<FileData[]>([]);
  const [width] = useWindowSize();
  const classes = useStyles();

  React.useEffect(() => {
    if (reanderedFunc) {
      reanderedFunc();
    }
  }, []);

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

  React.useEffect(() => {
    const f = async () => {
      let newFileData: FileData[] = [];
      if (userId) {
        newFileData = await fileDataByUserId(userId);
      } else if (isMine) {
        newFileData = mineFileData;
      } else {
        newFileData = allFileData;
      }
      setFileData(newFileData);
    };
    f();
  }, [userId, mineFileData, allFileData]);

  const fileDataCardExceptByGapFunc = (cardRow: number) => {
    const num = `${baseStyle.fileAreaFileDataCardGap.main} * ${
      cardRow - 1
    } / ${cardRow}`;
    return num;
  };

  return (
    <div className={`${classes.fileArea} ${className}`}>
      {fileData.length ? (
        fileData.map((data, i) => (
          <FileDataCard
            style={{ width: fileDataCardWidth }}
            className={classes.fileDataCard}
            fileData={data}
            key={i}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  fileDataCard: {},
  fileArea: {
    width: "100%",
    padding: 0,
    display: "flex",
    gap: baseStyle.fileAreaFileDataCardGap.main,
    flexWrap: "wrap",
  },
});
