import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

interface StyleProps {
  backgroundColor?: string;
}

const useSnackbarStyles = createUseStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: theme.spacing(5),
  },
  wrapper: ({ backgroundColor }: StyleProps) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: backgroundColor || theme.palette.white,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: backgroundColor ? "none" : `solid 1.5px ${theme.palette.grey.veryLight}`,
    boxShadow: "0 7px 22px -2px rgba(136, 139, 170, 0.15)",
  }),
  message: ({ backgroundColor }: StyleProps) => ({
    textAlign: "center",
    color: backgroundColor ? theme.palette.white : theme.palette.black.main,
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
