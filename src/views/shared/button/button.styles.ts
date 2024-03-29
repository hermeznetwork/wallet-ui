import { createUseStyles } from "react-jss";

import { Theme } from "src/styles/theme";

interface RootStyleProps {
  rounded: boolean;
}

const useButtonStyles = createUseStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    border: "none",
    width: "fit-content",
    margin: `${theme.spacing(2)} auto 0 auto`,
    padding: ({ rounded }: RootStyleProps) =>
      rounded ? theme.spacing(2) : `${theme.spacing(1.5)}px ${theme.spacing(2.5)}px`,
    borderRadius: ({ rounded }: RootStyleProps) => (rounded ? "50%" : 50),
    background: theme.palette.primary.dark,
    color: theme.palette.grey.main,
    fontWeight: theme.fontWeights.medium,
    transition: theme.hoverTransition,
    cursor: "pointer",
    "&:focus": {
      outline: "none",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "default",
    },
    "&:hover:not(:disabled)": {
      background: theme.palette.primary.hover,
    },
  },
  textSpacer: {
    marginLeft: theme.spacing(1),
  },
}));

export default useButtonStyles;
