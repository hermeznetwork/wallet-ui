import { createUseStyles } from "react-jss";

const useQuoteSidenavStyles = createUseStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3.75),
  },
  lpLogo: {
    color: theme.palette.black.main,
    textAlign: "center",
    marginBottom: theme.spacing(1.5),
  },
  lpUrl: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(3),
  },
  lpDescription: {
    color: theme.palette.black.main,
    fontWeight: theme.fontWeights.bold,
    lineHeight: 1.5,
    textAlign: "center",
  },
}));

export default useQuoteSidenavStyles;
