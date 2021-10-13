import { createUseStyles } from "react-jss";

const useFiatAmountStyles = createUseStyles((theme) => ({
  fiatAmount: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
  },
}));

export default useFiatAmountStyles;
