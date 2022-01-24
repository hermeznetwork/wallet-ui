import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

interface StyleProps {
  type: "error" | "info-msg" | "success-msg" | "error-msg";
}

const useSnackbarStyles = createUseStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: theme.spacing(5),
  },
  wrapper: ({ type }: StyleProps) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      type === "info-msg"
        ? theme.palette.white
        : type === "success-msg"
        ? theme.palette.green
        : theme.palette.red.main,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: type !== "info-msg" ? "none" : `solid 1.5px ${theme.palette.grey.veryLight}`,
    boxShadow: "0 7px 22px -2px rgba(136, 139, 170, 0.15)",
  }),
  message: ({ type }: StyleProps) => ({
    textAlign: "center",
    color: type === "info-msg" ? theme.palette.black.main : theme.palette.white,
    fontWeight: theme.fontWeights.bold,
    flex: 1,
  }),
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  reportButton: {
    textTransform: "uppercase",
    color: theme.palette.white,
    border: "2px solid",
    backgroundColor: "transparent",
    margin: `0 ${theme.spacing(1)}px`,
    lineHeight: "14px",
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover:not(:disabled)": {
      background: "transparent",
    },
  },
}));

export default useSnackbarStyles;
