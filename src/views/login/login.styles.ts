import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useLoginStyles = createUseStyles((theme: Theme) => ({
  networkName: {
    marginBottom: theme.spacing(8),
  },
  connectText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(6),
    color: theme.palette.grey.dark,
  },
  addAccountText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(6),
  },
  connectedText: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing(6),
  },
}));

export default useLoginStyles;
