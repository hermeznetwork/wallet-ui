import { createUseStyles } from "react-jss";

const useQuoteStyles = createUseStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  bestQuoteContainer: {
    display: "flex",
    alignItems: "center",
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.grey.hover}`,
    marginBottom: theme.spacing(2),
  },
  bestQuoteBadge: {
    width: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  bestQuoteText: {
    color: theme.palette.black,
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
  },
  quoteInfo: {
    display: "flex",
    justifyContent: "space-between",
  },
  nameCell: {
    flex: "1 1 40%",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: theme.spacing(3.5),
    marginLeft: theme.spacing(2),
  },
  name: {
    marginLeft: theme.spacing(1),
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
  },
  moreInfoButton: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    background: theme.palette.white,
    appearance: "none",
    border: 0,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    marginLeft: theme.spacing(1),
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  toTokenAmountCell: {
    flex: "1 1 40%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  toTokenAmount: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.black,
  },
  toTokenAmountDiff: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.red.main,
    marginTop: theme.spacing(1),
  },
  rewardCell: {
    flex: "1 1 20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  reward: {
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(1),
    color: theme.palette.black,
  },
  rewardHelperText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
  },
}));

export default useQuoteStyles;
