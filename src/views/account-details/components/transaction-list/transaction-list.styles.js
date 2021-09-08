import { createUseStyles } from "react-jss";

const useTransactionListStyles = createUseStyles((theme) => ({
  transaction: {
    cursor: "pointer",
    width: "100%",
    borderBottom: `0.5px solid ${theme.palette.grey.light}`,
  },
}));

export default useTransactionListStyles;
