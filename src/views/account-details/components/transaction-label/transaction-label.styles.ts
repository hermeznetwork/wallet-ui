import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useTransactionLabelStyles = createUseStyles((theme: Theme) => ({
  root: {
    fontWeight: theme.fontWeights.bold,
  },
}));

export default useTransactionLabelStyles;
