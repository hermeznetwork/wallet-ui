import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useTransactionAmountStyles = createUseStyles((theme: Theme) => ({
  depositAmount: { color: theme.palette.green },
}));

export default useTransactionAmountStyles;
