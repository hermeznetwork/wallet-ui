import React from "react";

import { AppAction } from "src/store";
import { SnackbarState, HeaderState } from "src/store/global/global.reducer";
import MainHeader from "src/views/shared/main-header/main-header.view";
import PageHeader from "src/views/shared/page-header/page-header.view";
import Snackbar from "src/views/shared/snackbar/snackbar.view";

interface BaseLayoutProps {
  header: HeaderState;
  snackbar: SnackbarState;
  onGoBack: (action: AppAction) => void;
  onClose: (action: AppAction) => void;
  onCloseSnackbar: () => void;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  header,
  snackbar,
  children,
  onGoBack,
  onClose,
  onCloseSnackbar,
}) => {
  return (
    <>
      {header.type === "main" && <MainHeader />}
      {header.type === "page" && (
        <PageHeader
          title={header.data.title}
          subtitle={header.data.subtitle}
          goBackAction={header.data.goBackAction}
          closeAction={header.data.closeAction}
          onGoBack={onGoBack}
          onClose={onClose}
        />
      )}
      {children}
      {snackbar.status === "open" && (
        <Snackbar
          message={snackbar.message}
          backgroundColor={snackbar.backgroundColor}
          autoClose={snackbar.autoClose}
          onClose={onCloseSnackbar}
        />
      )}
    </>
  );
};

export default BaseLayout;
