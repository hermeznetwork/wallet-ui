import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

interface StyleProps {
  hasPendingDeposit: boolean;
  isDisabled: boolean;
}

const useAccountStyles = createUseStyles((theme: Theme) => ({
  root: ({ hasPendingDeposit, isDisabled }: StyleProps) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: hasPendingDeposit ? theme.palette.black.main : theme.palette.grey.light,
    borderRadius: theme.spacing(2),
    cursor: isDisabled ? "default" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? "none" : "all",
    transition: theme.hoverTransition,
    "&:hover": {
      backgroundColor: hasPendingDeposit ? theme.palette.black.hover : theme.palette.primary.hover,
    },
  }),
  account: {
    padding: theme.spacing(2.5),
    [theme.breakpoints.upSm]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    },
  },
  values: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topRow: ({ hasPendingDeposit }: StyleProps) => ({
    marginBottom: theme.spacing(1.5),
    "& p": {
      color: hasPendingDeposit ? theme.palette.white : theme.palette.black.main,
    },
  }),
  topRowText: {
    fontSize: theme.spacing(2),
    [theme.breakpoints.upSm]: {
      fontSize: theme.spacing(2.5),
    },
  },
  tokenName: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
  },
  tokenSymbol: {
    fontWeight: theme.fontWeights.bold,
  },
  tokenBalance: {
    fontWeight: theme.fontWeights.medium,
  },
  fiatBalance: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
  },
  bottomRow: ({ hasPendingDeposit }: StyleProps) => ({
    color: hasPendingDeposit ? theme.palette.grey.dark : theme.palette.grey.main,
  }),
  pendingContainer: {
    display: "flex",
    alignItems: "center",
  },
  pendingLabelContainer: {
    backgroundColor: theme.palette.orange.light,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginTop: -theme.spacing(0.5),
  },
  pendingLabelText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.orange.main,
  },
  pendingTimer: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey.dark,
    fontWeight: theme.fontWeights.medium,
  },
}));

export default useAccountStyles;
