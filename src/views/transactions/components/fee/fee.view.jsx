import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { parseUnits } from "ethers/lib/utils";

import useFeeStyles from "./fee.styles";
import {
  getAmountInPreferredCurrency,
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency,
} from "../../../../utils/currencies";
import { ReactComponent as AngleDownIcon } from "../../../../images/icons/angle-down.svg";
import FeesTable from "../../../shared/fees-table/fees-table.view";
import { getRealFee } from "../../../../utils/fees";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";

function Fee({
  transactionType,
  amount,
  fee,
  estimatedWithdrawFee,
  token,
  preferredCurrency,
  fiatExchangeRates,
  showInFiat,
  depositFee,
}) {
  const [isWithdrawFeeExpanded, setIsWithdrawFeeExpanded] = React.useState(false);
  const classes = useFeeStyles({ isWithdrawFeeExpanded });
  const l2RealFee = getRealFee(amount, token, fee);
  const l2FeeInFiat = getTokenAmountInPreferredCurrency(
    l2RealFee,
    token.USD,
    preferredCurrency,
    fiatExchangeRates
  );

  function getDepositFee() {
    if (depositFee) {
      const fiatAmount = getTokenAmountInPreferredCurrency(
        depositFee.amount,
        depositFee.USD,
        preferredCurrency,
        fiatExchangeRates
      );
      return (
        <>
          Ethereum fee (estimated) - <span>{depositFee.amount} ETH</span> ~{" "}
          <FiatAmount
            amount={fiatAmount}
            currency={preferredCurrency}
            className={classes.fiatAmount}
          />
        </>
      );
    }
    return null;
  }

  function getTotalEstimatedWithdrawFee() {
    if (!estimatedWithdrawFee?.USD) {
      return undefined;
    }

    const estimatedWithdrawFeeInFiat = getAmountInPreferredCurrency(
      estimatedWithdrawFee.USD,
      preferredCurrency,
      fiatExchangeRates
    );

    return l2FeeInFiat + estimatedWithdrawFeeInFiat;
  }

  function handleWithdrawFeeExpansion() {
    setIsWithdrawFeeExpanded(!isWithdrawFeeExpanded);
  }

  if (
    transactionType === TxType.Transfer ||
    transactionType === TxType.TransferToBJJ ||
    transactionType === TxType.TransferToEthAddr
  ) {
    return (
      <p className={classes.fee}>
        Fee&nbsp;
        {showInFiat ? (
          <FiatAmount amount={l2FeeInFiat} currency={preferredCurrency} />
        ) : (
          <span>
            {`${getFixedTokenAmount(
              parseUnits(l2RealFee.toString(), token.decimals),
              token.decimals
            )} 
              ${token.symbol}`}
          </span>
        )}
      </p>
    );
  }

  if (transactionType === TxType.Deposit) {
    return <p className={classes.fee}>{getDepositFee()}</p>;
  }

  if (transactionType === TxType.Exit) {
    return (
      <div className={classes.withdrawFeeWrapper}>
        <button className={classes.withdrawFeeButton} onClick={handleWithdrawFeeExpansion}>
          <span className={classes.withdrawFeeButtonText}>
            Total estimated fee{" "}
            <FiatAmount
              amount={getTotalEstimatedWithdrawFee()}
              currency={preferredCurrency}
              className={classes.fiatAmount}
            />
          </span>
          <AngleDownIcon
            className={`${classes.withdrawFeeButtonIcon} ${classes.withdrawFeeButtonIconPath}`}
          />
        </button>
        {isWithdrawFeeExpanded && (
          <FeesTable
            l2Fee={getRealFee(amount, token, fee)}
            estimatedWithdrawFee={estimatedWithdrawFee}
            token={token}
            preferredCurrency={preferredCurrency}
            fiatExchangeRates={fiatExchangeRates}
          />
        )}
      </div>
    );
  }

  return <></>;
}

export default Fee;