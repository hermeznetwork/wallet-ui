import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useTransactionListStyles = createUseStyles((theme: Theme) => ({
  transaction: {
    cursor: "pointer",
    width: "100%",
    borderBottom: `0.5px solid ${theme.palette.grey.light}`,
  },
}));

export default useTransactionListStyles;
