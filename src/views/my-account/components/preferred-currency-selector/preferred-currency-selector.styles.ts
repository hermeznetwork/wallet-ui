import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const usePreferredCurrencySelectorStyles = createUseStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  inputGroupSpacer: {
    marginLeft: theme.spacing(3.5),
  },
  input: {
    marginRight: theme.spacing(1),
  },
  label: {
    fontWeight: theme.fontWeights.medium,
  },
}));

export default usePreferredCurrencySelectorStyles;
