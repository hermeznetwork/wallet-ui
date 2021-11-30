import React from "react";

import useReceiverInputStyles from "src/views/transactions/transfer/components/receiver-input/receiver-input.styles";
import { isAnyVideoDeviceAvailable, isFirefox, readFromClipboard } from "src/utils/browser";
import {
  getPartiallyHiddenHermezAddress,
  isValidEthereumAddress,
  isValidHermezAddress,
} from "src/utils/addresses";
import { isHermezBjjAddress } from "@hermeznetwork/hermezjs/src/addresses";
import { ReactComponent as ErrorIcon } from "src/images/icons/error.svg";
import { ReactComponent as CloseIcon } from "src/images/icons/close.svg";
import { ReactComponent as QRScannerIcon } from "src/images/icons/qr-scanner.svg";
import QRScanner from "src/views/shared/qr-scanner/qr-scanner.view";

export interface ReceiverInputChangeEventData {
  value: string;
  isValid?: boolean;
}

interface ReceiverInputStateProps {
  defaultValue?: string;
  hasReceiverApprovedAccountsCreation?: boolean;
}

interface ReceiverInputHandlerProps {
  onChange: (data: ReceiverInputChangeEventData) => void;
}

type ReceiverInputProps = ReceiverInputStateProps & ReceiverInputHandlerProps;

function ReceiverInput({
  defaultValue,
  hasReceiverApprovedAccountsCreation,
  onChange,
}: ReceiverInputProps): JSX.Element {
  const classes = useReceiverInputStyles();
  const [value, setValue] = React.useState(defaultValue || "");
  const [isReceiverValid, setIsReceiverValid] = React.useState<boolean | undefined>(undefined);
  const [isVideoDeviceAvailable, setIsVideoDeviceAvailable] = React.useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = React.useState(false);
  const hasErrors = isReceiverValid === false || hasReceiverApprovedAccountsCreation === false;

  React.useEffect(() => {
    isAnyVideoDeviceAvailable()
      .then(setIsVideoDeviceAvailable)
      .catch(() => setIsVideoDeviceAvailable(false));
  }, []);

  function getErrorMessage() {
    if (isReceiverValid === false) {
      return "Please, enter a valid Hermez or Ethereum Address";
    }
    if (hasReceiverApprovedAccountsCreation === false) {
      return "Please, enter an existing address. Receiver needs to have signed in to Hermez Wallet at least once.";
    }

    return "";
  }

  /**
   * Checks if the receiver is a valid Hermez address. Change error state based on that.
   */
  function handleInputChange(eventOrAddress: React.ChangeEvent<HTMLInputElement> | string) {
    const newValueUntrimmed =
      typeof eventOrAddress === "string" ? eventOrAddress : eventOrAddress.target.value;
    const newValue = newValueUntrimmed.trim();

    if (newValue === "") {
      return handleDeleteClick();
    }

    if (isValidHermezAddress(newValue) || isHermezBjjAddress(newValue)) {
      const changeEventData: ReceiverInputChangeEventData = { value: newValue, isValid: true };

      setValue(changeEventData.value);
      setIsReceiverValid(changeEventData.isValid);
      onChange(changeEventData);
    } else if (isValidEthereumAddress(newValue)) {
      const changeEventData: ReceiverInputChangeEventData = {
        value: `hez:${newValue}`,
        isValid: true,
      };

      setValue(changeEventData.value);
      setIsReceiverValid(changeEventData.isValid);
      onChange(changeEventData);
    } else {
      const changeEventData: ReceiverInputChangeEventData = { value: newValue, isValid: false };

      setValue(changeEventData.value);
      setIsReceiverValid(changeEventData.isValid);
      onChange(changeEventData);
    }
  }

  /**
   * Sets the receiver to the content read from the clipboard
   */
  function handlePasteClick() {
    void readFromClipboard().then(handleInputChange).catch(console.error);
  }

  /**
   * Resets the receiver input when the delete button is clicked
   */
  function handleDeleteClick() {
    const changeEventData: ReceiverInputChangeEventData = { value: "" };

    setValue(changeEventData.value);
    setIsReceiverValid(changeEventData.isValid);
    onChange(changeEventData);
  }

  /**
   * Sets the local state variable isQRScannerOpen to true when the user requests to open
   * the QR Scanner
   */
  function handleOpenQRScanner() {
    setIsQRScannerOpen(true);
  }

  /**
   * Sets the local state variable isQRScannerOpen to false when the user requests to
   * close the QR Scanner
   */
  function handleCloseQRScanner() {
    setIsQRScannerOpen(false);
  }

  /**
   * Sets the receiver local state variable with the scanned Hermez or Ethereum Address
   */
  function handleReceiverScanningSuccess(address: string) {
    setIsQRScannerOpen(false);
    handleInputChange(address);
  }

  return (
    <div className={classes.root}>
      <div className={classes.inputWrapper}>
        <input
          disabled={isReceiverValid}
          className={classes.input}
          value={isReceiverValid ? getPartiallyHiddenHermezAddress(value) : value}
          onChange={handleInputChange}
          type="text"
          placeholder="To hez:0x2387 ･･･ 5682"
        />
        <div className={classes.buttonGroup}>
          {
            // Pasting is not supported in firefox
            value.length === 0 && !isFirefox() && (
              <button
                type="button"
                className={classes.button}
                tabIndex={-1}
                onClick={handlePasteClick}
              >
                Paste
              </button>
            )
          }
          {value.length > 0 && (
            <button
              type="button"
              className={classes.button}
              tabIndex={-1}
              onClick={handleDeleteClick}
            >
              <CloseIcon className={classes.deleteButtonIcon} />
            </button>
          )}
          {value.length === 0 && isVideoDeviceAvailable && (
            <button
              type="button"
              className={classes.button}
              tabIndex={-1}
              onClick={handleOpenQRScanner}
            >
              <QRScannerIcon className={classes.buttonIcon} />
            </button>
          )}
        </div>
      </div>
      {hasErrors && (
        <p className={classes.errorMessage}>
          <ErrorIcon className={classes.errorIcon} />
          {getErrorMessage()}
        </p>
      )}
      {isVideoDeviceAvailable && isQRScannerOpen && (
        <QRScanner
          hideMyCode
          onSuccess={handleReceiverScanningSuccess}
          onClose={handleCloseQRScanner}
        />
      )}
    </div>
  );
}

export default ReceiverInput;
