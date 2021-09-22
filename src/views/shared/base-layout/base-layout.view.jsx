import React from "react";

import MainHeader from "../main-header/main-header.view";
import PageHeader from "../page-header/page-header.view";
import Snackbar from "../snackbar/snackbar.view";

function BaseLayout({
  header,
  snackbar,
  preferredCurrency,
  fiatExchangeRatesTask,
  children,
  onGoBack,
  onClose,
  onCloseSnackbar,
}) {
  return (
    <>
      {header.type === "main" && <MainHeader showNotificationsIndicator={false} />}
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
          onClose={onCloseSnackbar}
        />
      )}
    </>
  );
}

export default BaseLayout;
