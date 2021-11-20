import { createUseStyles } from "react-jss";
import { AlertVariant } from "src/views/shared/alert/alert.view";
import { Theme } from "src/styles/theme";

const useAlertStyles = createUseStyles<
  "root" | "icon" | "messageWrapper" | "message" | "helpButton",
  { variant: AlertVariant },
  Theme
>((theme: Theme) => ({
  root: ({ variant }) => ({
    width: "100%",
    fontSize: theme.spacing(1.75),
    background: variant === "light" ? theme.palette.white : theme.palette.black,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  icon: ({ variant }) => ({
    flexShrink: 0,
    width: theme.spacing(2),
    marginRight: theme.spacing(1),
    "& path": {
      fill: variant === "light" ? theme.palette.grey.dark : theme.palette.white,
    },
  }),
  messageWrapper: {
    display: "flex",
    alignItems: "flex-start",
  },
  message: ({ variant }) => ({
    fontWeight: theme.fontWeights.medium,
    color: variant === "light" ? theme.palette.grey.dark : theme.palette.white,
    lineHeight: 1.57,
  }),
  helpButton: {
    fontWeight: theme.fontWeights.medium,
    appearance: "none",
    border: 0,
    borderRadius: theme.spacing(2),
    cursor: "pointer",
    background: theme.palette.grey.dark05,
    color: theme.palette.white,
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    whiteSpace: "nowrap",
    marginLeft: theme.spacing(12.5),
    transition: theme.hoverTransition,
    "&:hover": {
      background: theme.palette.grey.hover,
    },
  },
}));

export default useAlertStyles;
