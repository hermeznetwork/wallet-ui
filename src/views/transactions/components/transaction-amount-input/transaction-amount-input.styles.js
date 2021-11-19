import { createUseStyles } from "react-jss";

const useTransactionAmountInputStyles = createUseStyles((theme) => ({
  root: {
    width: "100%",
  },
  selectAmount: {
    border: `solid 2px ${theme.palette.grey.veryLight}`,
    borderRadius: 12,
    width: "100%",
  },
  selectAmountError: {
    borderColor: theme.palette.red.main,
  },
  amount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      padding: `${theme.spacing(5)}px ${theme.spacing(6)}px ${theme.spacing(4)}px`,
    },
  },
  amountCurrency: {
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      marginBottom: theme.spacing(1.5),
    },
  },
  amountInput: {
    width: "100%",
    border: 0,
    outline: "none",
    caretColor: theme.palette.purple.main,
    fontSize: `${theme.spacing(5)}px`,
    fontWeight: theme.fontWeights.bold,
    color: theme.palette.black,
    textAlign: "center",
    "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&[type=number]": {
      "-moz-appearance": "textfield",
    },
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(5)}px`,
    },
  },
  amountButtons: {
    display: "flex",
    borderTop: `solid 2px ${theme.palette.grey.veryLight}`,
    justifyContent: "space-between",
    padding: `0 ${theme.spacing(3)}px`,
    [theme.breakpoints.upSm]: {
      padding: `0 ${theme.spacing(6)}px`,
    },
  },
  amountButtonsItem: {
    background: "none",
    outline: "none",
    border: 0,
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    padding: `${theme.spacing(2)}px 0`,
    textAlign: "center",
    [theme.breakpoints.upSm]: {
      fontSize: `${theme.spacing(2.5)}px`,
      lineHeight: `${theme.spacing(2.5)}px`,
      padding: `${theme.spacing(2)}px 0 ${theme.spacing(2.5)}px`,
    },
  },
  amountButton: {
    cursor: "pointer",
    transition: theme.hoverTransition,
    "&:hover": {
      color: theme.palette.black,
      "& path": {
        fill: theme.palette.black,
      },
    },
  },
  amountMax: {
    fontWeight: theme.fontWeights.bold,
  },
  changeCurrency: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  changeCurrencyIcon: {
    height: theme.spacing(2.5),
  },
  errorMessage: {
    display: "none",
    alignItems: "center",
    marginTop: theme.spacing(1.5),
    fontSize: `${theme.spacing(2)}px`,
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.red.main,
    width: "100%",
  },
  selectAmountErrorMessageVisible: {
    display: "flex",
  },
  errorIcon: {
    marginRight: theme.spacing(1),
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
}));

export default useTransactionAmountInputStyles;
