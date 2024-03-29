import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useAccountDetailsStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  section: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fiatBalanceWrapper: {
    marginBottom: theme.spacing(3),
  },
  fiatBalance: {
    color: theme.palette.grey.dark,
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
  },
  tokenBalance: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

export default useAccountDetailsStyles;
