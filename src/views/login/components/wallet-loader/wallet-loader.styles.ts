import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useWalletLoaderStyles = createUseStyles((theme: Theme) => ({
  root: {},
  followInstructionsText: {
    lineHeight: 1.75,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing(2),
    maxWidth: 176,
    textAlign: "center",
  },
}));

export default useWalletLoaderStyles;
