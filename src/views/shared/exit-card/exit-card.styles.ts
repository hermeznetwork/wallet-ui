import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useExitCardStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: theme.palette.black,
    padding: `${theme.spacing(2.5)}px ${theme.spacing(5)}px ${theme.spacing(3.5)}px`,
    marginBottom: `${theme.spacing(2.5)}px`,
  },
  step: {
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.spacing(1.75),
    marginBottom: theme.spacing(2),
  },
  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  txType: {
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5),
  },
  amountFiat: {
    color: theme.palette.grey.dark,
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
  },
  rowBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTagWrapper: {
    borderRadius: 8,
    backgroundColor: theme.palette.purple.light,
    padding: `${theme.spacing(1)}px`,
  },
  stepTagWrapperTwo: {
    backgroundColor: theme.palette.red.light,
  },
  stepTag: {
    color: theme.palette.purple.dark,
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
  },
  stepTagTwo: {
    color: theme.palette.red.main,
  },
  pendingContainer: {
    display: "flex",
    alignItems: "center",
  },
  pendingTimer: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey.dark,
  },
  tokenAmount: {
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5),
  },
  withdraw: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    flexDirection: "column",
    borderTop: `1px solid ${theme.palette.grey.dark}`,
    paddingTop: theme.spacing(1.5),
    marginTop: theme.spacing(2.5),
    marginBottom: -theme.spacing(0.5),
  },
  withdrawInfo: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    color: theme.palette.grey.dark,
    "& p": {
      display: "flex",
      alignItems: "center",
    },
  },
  withdrawInfoDelayed: {
    flexDirection: "column",
    color: theme.palette.white,
    padding: `${theme.spacing(3.5)}px ${theme.spacing(3)}px`,
    backgroundColor: theme.palette.grey.dark05,
    borderRadius: 12,
  },
  withdrawInfoIcon: {
    justifyContent: "left",
    color: theme.palette.white,
  },
  infoIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
    fill: theme.palette.grey.dark,
  },
  infoBoxIcon: {
    fill: theme.palette.white,
  },
  infoText: {
    marginBottom: theme.spacing(2),
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    "&:last-child": {
      marginBottom: 0,
    },
  },
  withdrawDelayedButtons: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.palette.grey.dark}`,
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.upSm]: {
      flexDirection: "row",
    },
  },
}));

export default useExitCardStyles;
