import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const reportIssueButtonStyles = createUseStyles((theme: Theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    borderTop: `0.5px solid ${theme.palette.grey.veryLight}`,
    background: theme.palette.white,
    position: "fixed",
    bottom: 0,
  },
  text: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    padding: `${theme.spacing(1.5)}px 0`,
  },
  separator: {
    color: theme.palette.grey.main,
    padding: theme.spacing(1.5),
  },
}));

export default reportIssueButtonStyles;
