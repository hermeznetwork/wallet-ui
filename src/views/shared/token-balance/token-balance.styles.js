import { createUseStyles } from "react-jss";

const useTokenBalance = createUseStyles((theme) => ({
  root: {
    textAlign: "center",
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
  },
  amount: {
    margin: 0,
    fontSize: `${theme.spacing(5)}px`,
  },
}));

export default useTokenBalance;
