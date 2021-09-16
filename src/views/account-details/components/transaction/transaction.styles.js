import { createUseStyles } from "react-jss";

const useTransactionStyles = createUseStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${theme.spacing(3)}px 0`,
  },
  type: {
    marginRight: theme.spacing(2),
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topRow: {
    marginBottom: theme.spacing(2),
  },
  bottomRow: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
  },
  pendingContainer: {
    display: "flex",
  },
  pendingLabelContainer: {
    background: theme.palette.secondary.light,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    margin: `-${theme.spacing(1)}px 0`,
  },
  pendingLabelText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.secondary.dark,
  },
  pendingTimer: {
    marginLeft: theme.spacing(1),
  },
  invalidLabelContainer: {
    background: theme.palette.red.light,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    margin: `-${theme.spacing(1)}px 0`,
  },
  invalidLabelText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.red.main,
  },
  tokenSymbol: {
    fontWeight: theme.fontWeights.bold,
  },
}));

export default useTransactionStyles;
