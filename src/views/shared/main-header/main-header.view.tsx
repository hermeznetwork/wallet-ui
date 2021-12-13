import React from "react";
import { Link } from "react-router-dom";

import useMainHeaderStyles from "src/views/shared/main-header/main-header.styles";
import { ReactComponent as HermezLogo } from "src/images/hermez-logo.svg";
import { ReactComponent as UserAccountIcon } from "src/images/icons/user-account.svg";
import { ReactComponent as QRCodeIcon } from "src/images/icons/qr-code.svg";
import Container from "src/views/shared/container/container.view";

function MainHeader(): JSX.Element {
  const classes = useMainHeaderStyles();

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.headerContent}>
          <Link to="/my-account" className={`${classes.link} ${classes.myAccountLink}`}>
            <div className={classes.myAccountIconWrapper}>
              <UserAccountIcon />
            </div>
            <p className={classes.linkText}>My Account</p>
          </Link>
          <h1>
            <div className={classes.logo}>
              <HermezLogo />
            </div>
          </h1>
          <Link to="/my-code" className={`${classes.link} ${classes.myCodeLink}`}>
            <p className={classes.linkText}>My Code</p>
            <QRCodeIcon className={classes.myCodeIcon} />
          </Link>
        </div>
      </Container>
    </header>
  );
}

export default MainHeader;
