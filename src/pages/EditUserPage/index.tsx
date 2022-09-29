import { makeStyles } from "@material-ui/core";
import { AuthCard } from "components/AuthCard";

export const EditUserPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.editUserPage}>
      <AuthCard statusProp={"edit"} />
    </div>
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
