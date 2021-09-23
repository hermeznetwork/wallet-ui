import { createUseStyles } from "react-jss";

const useMainHeaderStyles = createUseStyles((theme) => ({
  root: {
    width: "100%",
    position: "absolute",
    height: theme.headerHeight,
    display: "flex",
    alignItems: "center",
    zIndex: 998,
    background: "transparent",
  },
  headerContent: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logo: {
    display: "flex",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  },
  myAccountLink: {
    left: 0,
    marginLeft: -theme.spacing(1),
  },
  myCodeLink: {
    right: 0,
    marginRight: -theme.spacing(1),
  },
  linkText: {
    fontWeight: theme.fontWeights.bold,
    whiteSpace: "nowrap",
  },
  myAccountIconWrapper: {
    marginRight: theme.spacing(1.5),
    position: "relative",
  },
  notificationsIndicator: {
    width: theme.spacing(1.25),
    height: theme.spacing(1.25),
    borderRadius: "50%",
    background: theme.palette.secondary.main,
    position: "absolute",
    bottom: 2,
    right: -1,
  },
  myCodeIcon: {
    marginLeft: theme.spacing(1.5),
  },
}));

export default useMainHeaderStyles;
