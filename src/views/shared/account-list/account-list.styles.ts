import { createUseStyles } from "react-jss";
import { Theme } from "src/styles/theme";

const useAccountListStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  accountSpacer: {
    marginTop: theme.spacing(2.5),
  },
}));

export default useAccountListStyles;
