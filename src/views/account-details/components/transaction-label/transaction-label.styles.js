import { createUseStyles } from "react-jss";

const useTransactionLabelStyles = createUseStyles((theme) => ({
  root: {
    fontWeight: theme.fontWeights.bold,
  },
}));

export default useTransactionLabelStyles;
