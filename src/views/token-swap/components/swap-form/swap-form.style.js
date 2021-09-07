import { createUseStyles } from "react-jss";

const useSwapFormStyles = createUseStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  circleBox: {
    height: theme.spacing(1),
    position: "relative",
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
  },
  circle: {
    position: "absolute",
    "& svg": {
      height: theme.spacing(4),
      marginTop: theme.spacing(-2),
      [theme.breakpoints.upSm]: {
        height: theme.spacing(5.25),
        marginTop: theme.spacing(-2.25),
      },
    },
    zIndex: "1",
  },
}));

export default useSwapFormStyles;
