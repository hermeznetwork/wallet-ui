import { createUseStyles } from "react-jss";

const useTransactionAmountStyles = createUseStyles((theme) => ({
  depositAmount: {
    "& p": { color: theme.palette.green },
  },
}));

export default useTransactionAmountStyles;
