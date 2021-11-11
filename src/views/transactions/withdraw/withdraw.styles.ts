import { Theme } from "src/styles/theme";
import { createUseStyles } from "react-jss";

const useWithdrawStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  spinnerWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.headerHeight,
    paddingTop: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      paddingTop: theme.spacing(6),
    },
  },
}));

export default useWithdrawStyles;
