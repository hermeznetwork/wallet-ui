import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { parseUnits } from "ethers/lib/utils";

import useFeeStyles from "./fee.styles";
import {
  CurrencySymbol,
  getAmountInPreferredCurrency,
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency,
} from "../../../../utils/currencies";
import { ReactComponent as AngleDownIcon } from "../../../../images/icons/angle-down.svg";
import FeesTable from "../fees-table/fees-table.view";
import { getRealFee } from "../../../../utils/fees";

function Fee({
  transactionType,
  amount,
  fee,
  estimatedWithdrawFee,
  token,
  preferredCurrency,
  fiatExchangeRates,
  showInFiat,
  tokensPriceTask,
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

  function getFeeInFiat() {
    return getTokenAmountInPreferredCurrency(fee, token.USD, preferredCurrency, fiatExchangeRates);
  }

  function getDepositFee() {
    if (tokensPriceTask.status == "successful") {
      const tokenFee = getFeeInFiat();
      return tokenFee / tokensPriceTask.data[0].USD;
    }
    return null;
  }

  function getTotalEstimatedWithdrawFee() {
    if (!estimatedWithdrawFee) {
      return "--";
    }

    const estimatedWithdrawFeeInFiat = getAmountInPreferredCurrency(
      estimatedWithdrawFee.USD,
      preferredCurrency,
      fiatExchangeRates
    );

    return (l2FeeInFiat + estimatedWithdrawFeeInFiat).toFixed(2);
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
      <div className={classes.feeWrapper}>
        <p className={classes.fee}>
          Fee&nbsp;
          <span>
            {showInFiat
              ? `${l2FeeInFiat.toFixed(2)} ${preferredCurrency}`
              : `${getFixedTokenAmount(
                  parseUnits(l2RealFee.toString(), token.decimals),
                  token.decimals
                )} ${token.symbol}`}
          </span>
        </p>
      </div>
    );
  }

  if (transactionType === TxType.Deposit) {
    const amountUSD = getFeeInFiat();
    return (
      <div className={classes.feeWrapper}>
        <p className={classes.fee}>
          Ethereum fee (estimated) -
          <span>{` ${getFixedTokenAmount(
            parseUnits(getDepositFee().toFixed(token.decimals).toString(), token.decimals),
            token.decimals
          )} ETH`}</span>
          {amountUSD ? ` ~ ${amountUSD} ${CurrencySymbol[preferredCurrency].symbol}` : ""}
        </p>
      </div>
    );
  }

  if (transactionType === TxType.Exit) {
    return (
      <div className={classes.withdrawFeeWrapper}>
        <button className={classes.withdrawFeeButton} onClick={handleWithdrawFeeExpansion}>
          <p className={classes.withdrawFeeButtonText}>
            Total estimated fee {CurrencySymbol[preferredCurrency].symbol}
            {getTotalEstimatedWithdrawFee()}
          </p>
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
