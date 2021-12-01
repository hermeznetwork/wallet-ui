import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useFormContainerStyles = createUseStyles((theme: Theme) => ({
  root: {
    marginTop: theme.headerHeight,
    marginBottom: theme.spacing(3),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      paddingTop: theme.spacing(3.5),
    },
  },
  section: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default useFormContainerStyles;
