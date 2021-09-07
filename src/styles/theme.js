const theme = {
  palette: {
    primary: {
      main: "#faf4ea",
      dark: "#f6e9d3",
      hover: "#ebdbc1",
    },
    secondary: {
      light: "#fef5ed",
      main: "#e75a2b",
      dark: "#d8853b",
      hover: "#d44d20",
    },
    white: "#ffffff",
    black: "#2b2b2b",
    grey: {
      veryLight: "#e1e1f1",
      light: "#f3f3f8",
      main: "#888baa",
      dark: "#7a7c89",
      dark05: "rgba(122, 124, 137, 0.5)",
      hover: "rgba(122, 124, 137, 0.2)",
    },
    red: {
      light: "rgba(255, 75, 64, 0.15)",
      main: "#ff4b40",
    },
    orange: {
      light: "rgba(242, 153, 74, 0.1)",
      main: "#ffa600",
      dark: "#d8853b",
    },
    green: "#219653",
  },
  hoverTransition: "all 100ms",
  fontWeights: {
    normal: "400",
    medium: "500",
    bold: "700",
    extraBold: "800",
  },
  breakpoints: {
    upSm: "@media (min-width: 576px)",
  },
  spacing: (value) => value * 8,
  headerHeight: 84,
  sidenavWidth: 295,
};

export default theme;
