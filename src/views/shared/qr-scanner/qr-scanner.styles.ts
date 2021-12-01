import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

const useQRScannerStyles = createUseStyles((theme: Theme) => ({
  section: {
    height: "100%",
    background: theme.palette.primary.main,
  },
  sectionContent: {
    display: "flex",
    width: "100%",
    position: "relative",
    borderRadius: theme.spacing(4),
    overflow: "hidden",
  },
  spinnerWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qrReaderWrapper: {
    width: "100%",
  },
  qrReaderFrame: {
    position: "absolute",
    right: 0,
    top: 0,
    left: 0,
    bottom: 0,
  },
  qrScannerMask: {
    width: "100%",
    height: "auto",
  },
  goBackButtonWrapper: {
    height: theme.headerHeight,
    position: "absolute",
    left: 0,
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  goBackButton: {
    display: "flex",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginLeft: -theme.spacing(2),
    cursor: "pointer",
    border: "none",
    background: "transparent",
    outline: "none",
  },
  goBackButtonIcon: {
    "& path": {
      fill: theme.palette.primary.main,
    },
  },
  myCodeButtonWrapper: {
    position: "absolute",
    bottom: "15%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  myCodeLabel: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    fontWeight: theme.fontWeights.bold,
  },
}));

export default useQRScannerStyles;
