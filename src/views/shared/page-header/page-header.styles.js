import { createUseStyles } from "react-jss";

const usePageHeaderStyles = createUseStyles((theme) => ({
  root: ({ hasSubtitle }) => ({
    width: "100%",
    position: "absolute",
    height: theme.headerHeight,
    display: "flex",
    alignItems: hasSubtitle ? "flex-end" : "center",
    zIndex: 998,
    background: "transparent",
  }),
  headerWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  titleWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  buttonBase: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    cursor: "pointer",
    border: "none",
    background: "transparent",
    outline: "none",
  },
  goBackButton: {
    left: 0,
    marginLeft: -theme.spacing(2),
  },
  closeButton: {
    right: 0,
    marginRight: -theme.spacing(2),
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.extraBold,
  },
  subtitle: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.dark,
    paddingTop: theme.spacing(1.25),
    margin: 0,
  },
}));

export default usePageHeaderStyles;
