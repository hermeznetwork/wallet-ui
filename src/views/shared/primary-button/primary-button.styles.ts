import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useFormButtonStyles = createUseStyles((theme: Theme) => ({
  root: {
    cursor: "pointer",
    width: "auto",
    marginTop: theme.spacing(6),
    padding: `${theme.spacing(2)}px ${theme.spacing(7)}px`,
    backgroundColor: theme.palette.secondary.main,
    border: 0,
    outline: "none",
    borderRadius: 100,
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.white,
    transition: theme.hoverTransition,
    "&:hover": {
      backgroundColor: theme.palette.secondary.hover,
    },
    "&:disabled": {
      backgroundColor: theme.palette.grey.main,
      cursor: "default",
    },
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
      padding: `${theme.spacing(3)}px ${theme.spacing(9)}px`,
    },
  },
  boxedButton: {
    marginTop: 0,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2),
    },
  },
  inRowButton: {
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.upSm]: {
      marginBottom: 0,
      fontSize: theme.spacing(2),
      width: theme.spacing(34),
    },
  },
  lastButton: {
    backgroundColor: theme.palette.grey.dark05,
    marginBottom: 0,
    "&:hover": {
      backgroundColor: theme.palette.grey.hover,
    },
  },
}));

export default useFormButtonStyles;
