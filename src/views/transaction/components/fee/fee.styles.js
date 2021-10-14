import { createUseStyles } from "react-jss";

const useFeeStyles = createUseStyles((theme) => ({
  fee: {
    marginTop: theme.spacing(2.5),
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
      padding: 0,
      marginTop: theme.spacing(3),
    },
  },
  fiatAmount: {
    color: theme.palette.grey.main,
  },
  withdrawFeeWrapper: {
    display: "flex",
    flexDirection: "column",
    padding: `0 ${theme.spacing(5)}px`,
    width: "100%",
  },
  withdrawFeeButton: {
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
