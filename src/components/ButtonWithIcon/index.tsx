import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { fontSize } from "theme";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  description: string;
  icon: React.ReactNode;
  fontWeight?: number;
}

export const ButtonWithIcon = (props: Props) => {
  const { onClick, description, icon, fontWeight = 400 } = props;
  const classes = useStyles();
  return (
    <Button className={classes.button} onClick={onClick} color="primary">
      <div className={classes.iconArea}>{icon}</div>
      <p style={{ fontWeight: fontWeight }}>{description}</p>
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
