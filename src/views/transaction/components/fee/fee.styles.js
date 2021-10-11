import { createUseStyles } from "react-jss";

const useFeeStyles = createUseStyles((theme) => ({
  feeWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      marginTop: theme.spacing(3),
    },
  },
  fee: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    display: "flex",
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
      padding: 0,
    },
    "& p": {
      color: theme.palette.grey.main,
    },
    "& span": {
      marginRight: theme.spacing(1),
    },
  },
  transfer: {
    "& p": {
      color: theme.palette.black,
    },
  },
  withdrawFeeWrapper: {
    display: "flex",
    flexDirection: "column",
    padding: `0 ${theme.spacing(5)}px`,
    width: "100%",
  },
  withdrawFeeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.spacing(2.5),
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    appearance: "none",
    border: 0,
    cursor: "pointer",
    background: "transparent",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
  withdrawFeeButtonText: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    marginRight: theme.spacing(1),
    color: theme.palette.grey.main,
  },
  withdrawFeeButtonIconPath: {
    "& path": {
      fill: theme.palette.grey.main,
    },
  },
  withdrawFeeButtonIcon: ({ isWithdrawFeeExpanded }) => ({
    transform: isWithdrawFeeExpanded ? "rotate(180deg)" : "rotate(0)",
  }),
}));

export default useFeeStyles;
