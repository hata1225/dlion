import React from "react";
import { makeStyles } from "@material-ui/core";
import { CoverImageInputArea } from "components/FileDataModal/CoverImageInputArea";
import { MainDataInputArea } from "components/FileDataModal/MainDataInputArea";
import { FileDataStatus } from "types/fileData";
import { baseStyle } from "theme";

interface Props {
  coverImage?: File;
  coverImageObjectUrl: string;
  setCoverImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  setCoverImageObjectUrl: React.Dispatch<React.SetStateAction<string>>;
  mainData?: File;
  mainDataObjectUrl: string;
  setMainData: React.Dispatch<React.SetStateAction<File | undefined>>;
  setMainDataObjectUrl: React.Dispatch<React.SetStateAction<string>>;
  mainDataStatus: FileDataStatus;
}

export const FileDataInputArea = React.memo(
  ({
    coverImage,
    coverImageObjectUrl,
    setCoverImage,
    setCoverImageObjectUrl,
    mainData,
    mainDataObjectUrl,
    setMainData,
    setMainDataObjectUrl,
    mainDataStatus,
  }: Props) => {
    const classes = useStyles();
    const [mainDataInputAreaWidth, setMainDataInputAreaWidth] = React.useState(0);
    const inputAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (inputAreaRef?.current?.clientWidth) {
        const inputAreaWidth = inputAreaRef.current.clientWidth;
        const newmainDataInputAreaWidth = (inputAreaWidth - parseInt(baseStyle.gap.small, 10)) / 2;
        setMainDataInputAreaWidth(newmainDataInputAreaWidth);
      }
    }, [inputAreaRef]);

    const handleChangeFileData = (
      e: React.ChangeEvent<HTMLInputElement>,
      setFileData: (value: React.SetStateAction<File | undefined>) => void,
      setFileDataObjectUrl: (value: React.SetStateAction<string>) => void
    ) => {
      if (e.target.files?.length) {
        const fileData = e.target.files[0];
        setFileData(fileData);
        const newFileDataObjectUrl = URL.createObjectURL(fileData);
        setFileDataObjectUrl(newFileDataObjectUrl);
      }
    };

    return (
      <div>
        <div className={classes.inputArea} ref={inputAreaRef}>
          <CoverImageInputArea
            coverImage={coverImage}
            coverImageObjectUrl={coverImageObjectUrl}
            handleChangeCoverImage={(e) =>
              handleChangeFileData(e, setCoverImage, setCoverImageObjectUrl)
            }
          />
          <MainDataInputArea
            mainData={mainData}
            mainDataObjectUrl={mainDataObjectUrl}
            handleChangeMainData={(e) => handleChangeFileData(e, setMainData, setMainDataObjectUrl)}
            mainDataStatus={mainDataStatus}
            mainDataInputAreaWidth={mainDataInputAreaWidth}
          />
        </div>
      </div>
    );
  }
);

const useStyles = makeStyles({
  inputArea: {
    width: "100%",
    display: "flex",
    gap: baseStyle.gap.small,
  },
});
