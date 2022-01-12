import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useTransactionInfoRowStyles = createUseStyles((theme: Theme) => ({
  root: {
    padding: `${theme.spacing(3.5)}px 0 ${theme.spacing(3)}px`,
    display: "flex",
    flexDirection: "column",
    borderBottom: `1px solid ${theme.palette.grey.veryLight}`,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topRow: {
    marginBottom: `${theme.spacing(1.5)}px`,
  },
  title: {
    fontWeight: theme.fontWeights.medium,
  },
  copyButton: {
    display: "flex",
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    border: 0,
    background: theme.palette.grey.light,
    borderRadius: "50%",
    cursor: "pointer",
    outline: "none",
  },
  copyIcon: {
    width: 14,
    height: 14,
    "& path": {
      fill: theme.palette.secondary.main,
    },
  },
  subtitle: {
    display: "flex",
    alignItems: "center",
    fontWeight: theme.fontWeights.bold,
  },
  hint: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
  },
  value: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
  },
}));

export default useTransactionInfoRowStyles;
