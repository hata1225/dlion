import { makeStyles, Button } from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius } from "theme";
import { FileDataStatus } from "types/fileData";

interface Props {
  mainData: File | undefined;
  mainDataObjectUrl: string;
  handleChangeMainData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mainDataStatus: FileDataStatus;
}

export const MainDataInputArea = React.memo(
  ({
    mainData,
    mainDataObjectUrl,
    handleChangeMainData,
    mainDataStatus,
  }: Props) => {
    const classes = useStyles();

    React.useEffect(() => {
      if (mainData) {
        const prevVideoElem = document.getElementById(
          "preview-video"
        ) as HTMLVideoElement | null;
        if (prevVideoElem) {
          prevVideoElem.volume = 0;
        }
      }
    }, [mainData]);

    const PreviewArea = () => {
      if (mainDataStatus === "video") {
        return (
          <video
            id="preview-video"
            className={classes.previewArea}
            src={mainDataObjectUrl}
            preload="metadata"
            controls
          />
        );
      } else if (mainDataStatus === "image" || mainDataStatus === "none") {
        return (
          <div
            className={classes.previewArea}
            style={{ backgroundImage: `url(${mainDataObjectUrl})` }}
          ></div>
        );
      } else if (mainDataStatus === "audio") {
        return (
          <div className={`${classes.previewArea} ${classes.audioWrap}`}>
            <audio src={mainDataObjectUrl} preload="metadata" controls></audio>
          </div>
        );
      } else {
        return <>{mainDataStatus} cannnot be upload.</>;
      }
    };

    return (
      <div className={classes.mainDataInputArea}>
        <PreviewArea />
        <Button variant="contained" color="primary" component="label" fullWidth>
          データを{mainData ? "変更" : "追加"}する
          <input
            style={{ display: "none" }}
            type="file"
            accept="*"
            onChange={(e) => handleChangeMainData(e)}
            onClick={(e: any) => {
              e.target.value = "";
            }}
          />
        </Button>
      </div>
    );
  }
);

const useStyles = makeStyles({
  mainDataInputArea: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  audioWrap: {
    display: "flex",
    alignItems: "center",
    aspectRatio: "unset !important",
    backgroundColor: "#fff !important",
  },
  previewArea: {
    height: "100%",
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: baseStyle.color.gray.main,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: borderRadius.main,
    verticalAlign: "bottom",
  },
});
