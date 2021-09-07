import { createUseStyles } from "react-jss";

const useTransactionActionsStyles = createUseStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
  },
  action: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    display: "flex",
    padding: theme.spacing(2.5),
    background: theme.palette.white,
    borderRadius: "50%",
    margin: `0 ${theme.spacing(2.5)}px ${theme.spacing(1.5)}px`,
    boxShadow: `0px 3px 16px ${theme.palette.orange.light}`,
    transition: theme.hoverTransition,
    "&:hover": {
      boxShadow: "none",
      transform: "scale(0.97)",
    },
  },
  buttonText: {
    fontWeight: theme.fontWeights.bold,
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
}));

export default useTransactionActionsStyles;
