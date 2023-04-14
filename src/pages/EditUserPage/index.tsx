import { makeStyles } from "@material-ui/core";
import { AuthCard } from "components/AuthCard";
import { Layout } from "components/Layout";

export const EditUserPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.editUserPage}>
        <AuthCard statusProp={"edit"} />
      </div>
    </Layout>
  );
};

const useStyles = makeStyles({
  editUserPage: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
