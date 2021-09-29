import React from "react";

import useTransactionErrorStyles from "./transaction-error.styles";
import transactionError from "../../../../images/transaction-error.png";
import PrimaryButton from "../../../shared/primary-button/primary-button.view";

function TransactionError({ onFinishTransaction }) {
  const classes = useTransactionErrorStyles();

  return (
    <section className={classes.root}>
      <img className={classes.image} src={transactionError} alt="Hermez transaction error" />
      <p className={classes.text}>There has been an error with your transaction.</p>
      <PrimaryButton label="Close" onClick={onFinishTransaction} />
    </section>
  );
}

export default TransactionError;
