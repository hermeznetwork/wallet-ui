import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useReceiverInputStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  inputWrapper: {
    width: "100%",
    position: "relative",
    marginTop: theme.spacing(4),
    borderRadius: 12,
    border: `solid 2px ${theme.palette.grey.veryLight}`,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  input: {
    width: "100%",
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(3)}px ${theme.spacing(
      2.5
    )}px`,
    fontSize: `${theme.spacing(2)}px`,
    color: theme.palette.black.main,
    fontWeight: theme.fontWeights.medium,
    outline: 0,
    border: "none",
    "&::placeholder": {
      color: theme.palette.grey.main,
      opacity: 1,
    },
    "&:disabled": {
      color: theme.palette.black.main,
      background: theme.palette.white,
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(
        5
      )}px`,
    },
  },
  buttonGroup: {
    display: "flex",
  },
  button: {
    border: 0,
    background: "transparent",
    outline: "none",
    cursor: "pointer",
    padding: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black.main,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
      marginRight: theme.spacing(3),
    },
  },
  buttonIcon: {
    width: 22,
    height: 22,
    "& path": {
      fill: theme.palette.black.main,
    },
  },
  deleteButtonIcon: {
    width: 32,
    height: 32,
  },
  errorMessage: {
    alignItems: "center",
    marginTop: theme.spacing(1.5),
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.red.main,
    width: "100%",
  },
  errorIcon: {
    marginRight: theme.spacing(1),
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
}));

export default useReceiverInputStyles;
