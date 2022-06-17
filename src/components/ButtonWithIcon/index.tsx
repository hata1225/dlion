import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { fontSize } from "theme";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  description: string;
  icon: React.ReactNode;
}

export const ButtonWithIcon = (props: Props) => {
  const { onClick, description, icon } = props;
  const classes = useStyles();
  return (
    <Button className={classes.button} onClick={onClick} color="primary">
      <div className={classes.iconArea}>{icon}</div>
      {description}
    </Button>
  );
};

const useStyles = makeStyles({
  button: {
    fontSize: fontSize.medium.medium,
    width: "200px",
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "35px",
  },
  iconArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "15px",
  },
});
