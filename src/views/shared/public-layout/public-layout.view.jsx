import React from "react";
import { useTheme } from "react-jss";

import usePublicLayoutStyles from "./public-layout.styles";
import * as constants from "../../../constants";
import Container from "../container/container.view";
import { ReactComponent as HermezLogoAlternative } from "../../../images/hermez-logo-alternative.svg";

function PublicLayout({ children }) {
  const theme = useTheme();
  const classes = usePublicLayoutStyles();

  return (
    <Container backgroundColor={theme.palette.primary.main} fullHeight disableTopGutter>
      <div className={classes.root}>
        <HermezLogoAlternative className={classes.logo} />
        <p className={classes.description}>Secure wallet for low-cost token transfers</p>
        {children}
        <div className={classes.legalContainer}>
          <a
            href={constants.PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.privacyPolicyUrl}
          >
            Privacy policy
          </a>
          <p className={classes.legalSeparator}>|</p>
          <a
            href={constants.TERMS_OF_SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.termsOfServiceUrl}
          >
            Terms of service
          </a>
        </div>
      </div>
    </Container>
  );
}

export default PublicLayout;
