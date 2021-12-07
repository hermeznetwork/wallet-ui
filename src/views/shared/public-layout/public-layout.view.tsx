import React from "react";
import { useTheme } from "react-jss";

import usePublicLayoutStyles from "src/views/shared/public-layout/public-layout.styles";
import Container from "src/views/shared/container/container.view";
import * as constants from "src/constants";
import { ReactComponent as HermezLogoAlternative } from "src/images/hermez-logo-alternative.svg";
import { Theme } from "src/styles/theme";

interface PublicLayoutProps {
  children: JSX.Element;
}

function PublicLayout({ children }: PublicLayoutProps): JSX.Element {
  const theme = useTheme<Theme>();
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
