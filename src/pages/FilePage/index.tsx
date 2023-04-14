import { makeStyles } from "@material-ui/core";
import { FileArea } from "../FileArea/index";
import { Layout } from "components/Layout";

export const FilePage = () => {
  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.filePage}>
        <FileArea className={classes.fileArea} />
      </div>
    </Layout>
  );
};

const useStyles = makeStyles({
  filePage: {
    width: "100%",
  },
  fileArea: {
    padding: "30px 0px 10px 0px",
  },
});
