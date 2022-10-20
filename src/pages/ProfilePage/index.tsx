import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { UserInterface } from "types/User";

export const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [user, setUser] = React.useState<UserInterface>();

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (id) {
    }
  }, [id]);

  return (
    <div className={classes.ProfilePage}>
      <div>
        <img src={user?.background_image} alt="" />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  ProfilePage: {
    width: "100%",
  },
});
