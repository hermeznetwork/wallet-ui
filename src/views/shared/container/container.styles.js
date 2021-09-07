import { createUseStyles } from "react-jss";

const useContainerStyles = createUseStyles((theme) => ({
  root: {
    flex: ({ fullHeight }) => (fullHeight ? "1 1 auto" : "0 0 auto"),
    width: "100%",
    background: ({ backgroundColor }) => backgroundColor || theme.white,
    paddingTop: ({ addHeaderPadding }) => (addHeaderPadding ? theme.headerHeight : 0),
  },
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    // 2 * theme.spacing(3.5) is the sides padding, so the real width is 700px
    maxWidth: 700 + 2 * theme.spacing(3.5),
    margin: "auto",
    padding: ({ disableGutters, disableVerticalGutters, disableTopGutter }) =>
      disableGutters
        ? 0
        : disableVerticalGutters
        ? `0 ${theme.spacing(3.5)}px`
        : disableTopGutter
        ? `0 ${theme.spacing(3.5)}px ${theme.spacing(5)}px`
        : `${theme.spacing(5)}px ${theme.spacing(3.5)}px`,
  },
}));

export default useContainerStyles;
