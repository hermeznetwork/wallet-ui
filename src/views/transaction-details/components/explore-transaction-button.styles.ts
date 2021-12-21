import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useExploreTransactionButtonStyles = createUseStyles((theme: Theme) => ({
  link: {
    fontWeight: theme.fontWeights.bold,
    display: "flex",
    alignItems: "center",
    color: theme.palette.grey.main,
    padding: theme.spacing(1),
    marginTop: theme.spacing(6),
  },
  linkIcon: {
    marginRight: theme.spacing(1.5),
    "& > path": {
      fill: theme.palette.grey.main,
    },
  },
}));

export default useExploreTransactionButtonStyles;
