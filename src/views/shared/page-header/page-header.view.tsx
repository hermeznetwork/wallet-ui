import React from "react";
import clsx from "clsx";

import { AppAction } from "src/store";
import Container from "src/views/shared/container/container.view";
import usePageHeaderStyles from "src/views/shared/page-header/page-header.styles";
import { ReactComponent as ArrowBackIcon } from "src/images/icons/arrow-back.svg";
import { ReactComponent as CloseIcon } from "src/images/icons/close.svg";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  goBackAction?: AppAction;
  closeAction?: AppAction;
  onGoBack: (action: AppAction) => void;
  onClose: (action: AppAction) => void;
}

function PageHeader({
  title,
  subtitle,
  goBackAction,
  closeAction,
  onGoBack,
  onClose,
}: PageHeaderProps): JSX.Element {
  const classes = usePageHeaderStyles({ hasSubtitle: subtitle !== undefined });

  return (
    <header className={classes.root}>
      <Container disableVerticalGutters>
        <div className={classes.headerWrapper}>
          <div className={classes.titleWrapper}>
            {goBackAction && (
              <button
                className={clsx({
                  [classes.buttonBase]: true,
                  [classes.goBackButton]: true,
                })}
                onClick={() => onGoBack(goBackAction)}
              >
                <ArrowBackIcon />
              </button>
            )}
            <h1 className={classes.title}>{title || ""}</h1>
            {closeAction && (
              <button
                className={clsx({
                  [classes.buttonBase]: true,
                  [classes.closeButton]: true,
                })}
                onClick={() => onClose(closeAction)}
              >
                <CloseIcon />
              </button>
            )}
          </div>
          {subtitle && <h4 className={classes.subtitle}>{subtitle}</h4>}
        </div>
      </Container>
    </header>
  );
}

export default PageHeader;
