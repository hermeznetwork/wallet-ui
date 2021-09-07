import { createUseStyles } from "react-jss";

const usePublicLayoutStyles = createUseStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: theme.palette.primary.main,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    width: 128,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.upSm]: {
      marginTop: theme.spacing(9),
    },
  },
  description: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing(7),
    textAlign: "center",
  },
  legalContainer: {
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(12.5),
    color: theme.palette.grey.dark,
  },
  legalSeparator: {
    margin: `0 ${theme.spacing(1.5)}px`,
    cursor: "default",
  },
  privacyPolicyUrl: {
    position: "absolute",
    transform: "translateX(-64px)",
    padding: theme.spacing(1),
  },
  termsOfServiceUrl: {
    position: "absolute",
    transform: "translateX(73px)",
    padding: theme.spacing(1),
  },
}));

export default usePublicLayoutStyles;
