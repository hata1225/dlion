import { makeStyles } from "@material-ui/core";
import { baseStyle } from "theme";

interface Props {
  isMarginVertical?: boolean;
}

export const FileDataModalLine = ({ isMarginVertical }: Props) => {
  const classes = useStyles();
  return (
    <div
      className={classes.fileDataModalLine}
      style={{
        marginTop: isMarginVertical ? "10px" : "0",
        marginBottom: isMarginVertical ? "10px" : "0",
      }}
    ></div>
  );
};

const useStyles = makeStyles({
  fileDataModalLine: {
    minHeight: "1px",
    width: "100%",
    backgroundColor: baseStyle.color.gray.main,
  },
});
