import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useSelectedAccountStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
    cursor: "pointer",
    display: "flex",
    border: "none",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.grey.light,
    borderRadius: 12,
    height: theme.spacing(7.5),
    marginBottom: theme.spacing(2.5),
    padding: theme.spacing(2.5),
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    transition: theme.hoverTransition,
    "&:hover": {
      backgroundColor: theme.palette.primary.hover,
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      height: theme.spacing(8),
      padding: `${theme.spacing(3)}px ${theme.spacing(5)}px ${theme.spacing(2.5)}px`,
      marginBottom: theme.spacing(2),
    },
  },
  tokenAmount: {
    fontWeight: theme.fontWeights.medium,
  },
}));

export default useSelectedAccountStyles;
