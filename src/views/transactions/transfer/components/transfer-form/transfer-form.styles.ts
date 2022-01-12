import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useTransferFormStyles = createUseStyles((theme: Theme) => ({
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
}));

export default useTransferFormStyles;
