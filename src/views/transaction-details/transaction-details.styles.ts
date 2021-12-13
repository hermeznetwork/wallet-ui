import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useTransactionDetailsStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  section: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  highlightedAmount: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  timeEstimate: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: theme.palette.grey.main,
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey.veryLight}`,
  },
  timeEstimateIcon: {
    fill: theme.palette.grey.main,
    width: 16,
    height: 16,
    marginRight: theme.spacing(1),
  },
}));

export default useTransactionDetailsStyles;
