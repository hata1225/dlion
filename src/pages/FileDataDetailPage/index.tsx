import { Card, makeStyles } from "@material-ui/core";
import { getFileData } from "api/api";
import React from "react";
import { useParams } from "react-router-dom";
import { FileData } from "types/fileData";
import { UserContext } from "../../contexts/UserContext";
import ReactHlsPlayer from "react-hls-player";
import { fontSize, shadow } from "theme";
import { DetailPageCard } from "components/DetailPageCard";

interface Props {}

export const FileDataDetailPage = ({}: Props) => {
  const [fileData, setFileData] = React.useState<FileData>();
  const { user } = React.useContext(UserContext);
  const { id } = useParams();
  const classes = useStyles();
  const playerRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    (async () => {
      if (user?.token && id) {
        const newFileData = await getFileData(user.token, Number(id));
        setFileData(newFileData);
      }
    })();
  }, [user?.token, id]);

  return (
    <div className={classes.fileDataDetailPage}>
      <div className={classes.headingArea}>
        <h2 className={classes.heading}>{fileData?.title}</h2>
      </div>
      <ReactHlsPlayer
        src={fileData ? fileData.video_data : ""}
        playerRef={playerRef}
        autoPlay={false}
        controls={true}
        width="100%"
        height="auto"
        hlsConfig={{
          maxBufferSize: 30 * 1000 * 1000,
        }}
      />
      <div className={classes.descriptionArea}>
        <p>{fileData?.description}</p>
      </div>
      <DetailPageCard fileData={fileData} />
    </div>
  );
};

const useStyles = makeStyles({
  fileDataDetailPage: {
    width: "calc(100% - 150px)",
    aspectRatio: "16 / 9",
    margin: "0 auto 70px auto",
  },
  headingArea: {
    padding: "25px 0",
  },
  heading: {
    fontSize: fontSize.large.large,
  },
  descriptionArea: {
    paddingTop: "10px",
  },
});
