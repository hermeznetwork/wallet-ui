import { createUseStyles } from "react-jss";

const useFormButtonStyles = createUseStyles((theme) => ({
  root: {
    cursor: "pointer",
    width: "auto",
    marginTop: theme.spacing(6),
    padding: `${theme.spacing(2)}px ${theme.spacing(7)}px`,
    backgroundColor: theme.palette.secondary.main,
    border: 0,
    outline: "none",
    borderRadius: 100,
    fontSize: `${theme.spacing(2)}px`,
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
      fontSize: `${theme.spacing(2.5)}px`,
      padding: `${theme.spacing(3)}px ${theme.spacing(9)}px`,
    },
  },
}));

export default useFormButtonStyles;
