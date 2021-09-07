import { createUseStyles } from "react-jss";

const usePortalStyles = createUseStyles((theme) => ({
  fullScreenModalRoot: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidenavRoot: {
    width: theme.sidenavWidth,
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: "auto",
  },
}));

export default usePortalStyles;
