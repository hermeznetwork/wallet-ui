import { createUseStyles } from "react-jss";

const useSelectedQuoteStyles = createUseStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(7),
  },
  loadingText: {
    fontSize: theme.spacing(1.75),
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    marginBottom: theme.spacing(3),
  },
  offerBox: {
    backgroundColor: theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px`,
    marginTop: theme.spacing(3),
  },
  row: {
    display: "block",
    [theme.breakpoints.upSm]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
  quote: {
    fontSize: theme.spacing(1.75),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2),
    },
  },
  quoteText: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
  },
  quoteRate: {
    color: theme.palette.black.main,
    fontWeight: theme.fontWeights.bold,
    margin: `${theme.spacing(1)}px 0`,
  },
  quotes: {
    backgroundColor: theme.palette.white,
    borderRadius: theme.spacing(10),
    border: "none",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    fontSize: theme.spacing(1.75),
    [theme.breakpoints.upSm]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
      fontSize: theme.spacing(2),
    },
    cursor: "pointer",
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.bold,
  },
  reward: {
    borderTop: `1px solid ${theme.palette.grey.veryLight}`,
    fontSize: theme.spacing(1.75),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2),
    },
    fontWeight: theme.fontWeights.medium,
    paddingTop: theme.spacing(1.75),
    marginTop: theme.spacing(2),
  },
  moreInfo: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(1.75),
    },
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  buttonBox: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    border: "none",
    color: theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
    },
    padding: `${theme.spacing(2.25)}px 0`,
    marginTop: theme.spacing(3),
    width: "50%",
    borderRadius: theme.spacing(10),
  },
  btnDisabled: {
    backgroundColor: theme.palette.grey.main,
  },
}));

export default useSelectedQuoteStyles;
