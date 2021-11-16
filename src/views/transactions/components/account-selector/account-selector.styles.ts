import { createUseStyles } from "react-jss";
import { Theme } from "src/styles/theme";

const useAccountSelectorStyles = createUseStyles((theme: Theme) => ({
  root: {
    marginTop: theme.headerHeight,
    marginBottom: theme.spacing(3),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      paddingTop: theme.spacing(6),
    },
  },
  accountListWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
  },
  accountListDeposit: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  accountListDepositText: {
    textAlign: "center",
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(4),
  },
}));

export default useAccountSelectorStyles;
