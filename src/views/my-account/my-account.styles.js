import { createUseStyles } from "react-jss";

const useMyAccountStyles = createUseStyles((theme) => ({
  root: {
    width: "100%",
  },
  hermezEthereumAddress: {
    fontSize: theme.spacing(2.5),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(2.5),
  },
  topSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonsWrapper: {
    display: "flex",
  },
  qrButton: {
    marginRight: theme.spacing(2),
  },
  qrIcon: {
    width: 20,
    height: 20,
    "& path": {
      fill: theme.palette.grey.dark,
    },
  },
  bottomSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  rewardsCard: {
    width: "100%",
    marginBottom: theme.spacing(4),
  },
  settingContainer: {
    display: "flex",
    flexDirection: "column",
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    marginLeft: `-${theme.spacing(1)}px`,
    background: "transparent",
    border: "none",
    "&:not(:first-child)": {
      cursor: "pointer",
    },
    "&:focus": {
      outline: "none",
    },
  },
  settingHeader: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  settingTitle: {
    fontWeight: theme.fontWeights.bold,
    marginLeft: theme.spacing(2),
  },
  settingSubTitle: {
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(4.5),
  },
  settingContent: {
    marginTop: theme.spacing(1.75),
    marginLeft: theme.spacing(4.5),
  },
}));

export default useMyAccountStyles;
