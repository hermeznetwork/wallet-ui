import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useWalletButtonListStyles = createUseStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  walletButtonContainer: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing(9),
    },
  },
}));

export default useWalletButtonListStyles;
