import { createUseStyles } from "react-jss";

const useCreateAccountAuthStyles = createUseStyles((theme) => ({
  accountAuth: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  accountAuthTitle: {
    fontSize: theme.spacing(2.5),
    lineHeight: `${theme.spacing(4)}px`,
    color: theme.palette.black,
    fontWeight: theme.fontWeights.bold,
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  accountAuthText: {
    fontSize: theme.spacing(2),
    lineHeight: `${theme.spacing(3.5)}px`,
    color: theme.palette.black,
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    marginBottom: theme.spacing(1),
    [theme.breakpoints.upSm]: {
      marginBottom: theme.spacing(11),
    },
  },
}));

export default useCreateAccountAuthStyles;
