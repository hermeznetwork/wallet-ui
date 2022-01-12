import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useMainHeaderStyles = createUseStyles((theme: Theme) => ({
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
  myCodeIcon: {
    marginLeft: theme.spacing(1.5),
  },
}));

export default useMainHeaderStyles;
