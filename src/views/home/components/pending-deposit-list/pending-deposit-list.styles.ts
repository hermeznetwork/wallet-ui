import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const usePendingDepositListStyles = createUseStyles((theme: Theme) => ({
  pendingDeposit: {
    width: "100%",
    marginBottom: theme.spacing(2.5),
  },
}));

export default usePendingDepositListStyles;
