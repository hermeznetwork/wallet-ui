import { createUseStyles } from "react-jss";

const useWalletButtonListStyles = createUseStyles((theme) => ({
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
