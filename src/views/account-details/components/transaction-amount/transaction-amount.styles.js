import { createUseStyles } from "react-jss";

const useTransactionAmountStyles = createUseStyles((theme) => ({
  depositAmount: {
    "& span": { color: theme.palette.green },
  },
}));

export default useTransactionAmountStyles;
