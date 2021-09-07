import React from "react";

import useAccountSelectorFormStyles from "./account-selector-form.styles";
import { ReactComponent as InfoIcon } from "../../../../images/icons/info.svg";
import FormButton from "../../../shared/form-button/form-button.view";

const ACCOUNTS_LIMIT = 20;
const DEFAULT_ACCOUNT = 0;

function AccountSelectorForm({ walletName, walletLabel, onSelectAccount }) {
  const classes = useAccountSelectorFormStyles();
  const accounts = Array(ACCOUNTS_LIMIT).fill();
  const [formData, setFormData] = React.useState({
    accountType: DEFAULT_ACCOUNT,
    accountIndex: DEFAULT_ACCOUNT,
  });

  function handleFormInputChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: parseInt(event.target.value),
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    onSelectAccount(walletName, formData);
  }

  return (
    <form className={classes.root} onSubmit={handleFormSubmit}>
      <select
        className={classes.select}
        name="accountType"
        defaultValue={formData.accountType}
        onChange={handleFormInputChange}
      >
        {accounts.map((_, index) => (
          <option key={index} value={index}>
            Account type {index}
          </option>
        ))}
      </select>
      <div className={classes.helperSection}>
        <InfoIcon className={classes.helperIcon} />
        <p className={classes.helperText}>The account type that you want to add</p>
      </div>
      <select
        className={classes.select}
        name="accountIndex"
        defaultValue={formData.accountIndex}
        onChange={handleFormInputChange}
      >
        {accounts.map((_, index) => (
          <option key={index} value={index}>
            Account index {index}
          </option>
        ))}
      </select>
      <div className={classes.helperSection}>
        <InfoIcon className={classes.helperIcon} />
        <p className={classes.helperText}>The account index of the account that you want to add</p>
      </div>
      <FormButton label={`Connect with ${walletLabel}`} type="submit" />
    </form>
  );
}

export default AccountSelectorForm;
