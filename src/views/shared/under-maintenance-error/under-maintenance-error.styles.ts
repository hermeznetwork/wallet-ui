import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useUnderMaintenanceErrorStyles = createUseStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 384,
    marginTop: theme.spacing(4),
  },
  icon: {
    width: 136,
    marginBottom: theme.spacing(5),
  },
  message: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    lineHeight: 1.6,
    textAlign: "center",
  },
}));

export default useUnderMaintenanceErrorStyles;
