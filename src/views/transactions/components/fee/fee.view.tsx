import React from "react";
import { TxType } from "@hermeznetwork/hermezjs/src/enums";
import { parseUnits } from "ethers/lib/utils";

import useFeeStyles from "src/views/transactions/components/fee/fee.styles";
import {
  getAmountInPreferredCurrency,
  getFixedTokenAmount,
  getTokenAmountInPreferredCurrency,
} from "src/utils/currencies";
import { ReactComponent as AngleDownIcon } from "src/images/icons/angle-down.svg";
import FeesTable from "src/views/shared/fees-table/fees-table.view";
import { getRealFee } from "src/utils/fees";
import FiatAmount from "src/views/shared/fiat-amount/fiat-amount.view";
// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
import { EstimatedWithdrawFee, EstimatedDepositFee } from "src/domain";

interface FeeProps {
  transactionType: TxType;
  amount: string;
  fee: number;
  estimatedWithdrawFee?: EstimatedWithdrawFee;
  token: Token;
  preferredCurrency: string;
  fiatExchangeRates: FiatExchangeRates;
  showInFiat: boolean;
  depositFee: EstimatedDepositFee;
}

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
}: FeeProps): JSX.Element {
  const [isWithdrawFeeExpanded, setIsWithdrawFeeExpanded] = React.useState(false);
  const classes = useFeeStyles({ isWithdrawFeeExpanded });
  const l2RealFee = getRealFee(amount, token, fee);
  const l2FeeInFiat = getTokenAmountInPreferredCurrency(
    l2RealFee.toString(),
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

  function getTotalEstimatedWithdrawFee(fee: EstimatedWithdrawFee) {
    const estimatedWithdrawFeeInFiat = getAmountInPreferredCurrency(
      fee.USD,
      preferredCurrency,
      fiatExchangeRates
    );

    return l2FeeInFiat + estimatedWithdrawFeeInFiat;
  }

  function handleWithdrawFeeExpansion() {
    setIsWithdrawFeeExpanded(!isWithdrawFeeExpanded);
  }

  switch (transactionType) {
    case TxType.Transfer:
    case TxType.TransferToBJJ:
    case TxType.TransferToEthAddr: {
      return (
        <p className={classes.fee}>
          Fee{" "}
          {showInFiat ? (
            <FiatAmount amount={l2FeeInFiat} currency={preferredCurrency} />
          ) : (
            <span>
              {`${getFixedTokenAmount(
                parseUnits(l2RealFee.toString(), token.decimals).toString(),
                token.decimals
              )} 
                ${token.symbol}`}
            </span>
          )}
        </p>
      );
    }
    case TxType.Deposit: {
      return <p className={classes.fee}>{getDepositFee()}</p>;
    }
    case TxType.Exit: {
      return estimatedWithdrawFee ? (
        <div className={classes.withdrawFeeWrapper}>
          <button className={classes.withdrawFeeButton} onClick={handleWithdrawFeeExpansion}>
            <span className={classes.withdrawFeeButtonText}>
              Total estimated fee{" "}
              <FiatAmount
                amount={getTotalEstimatedWithdrawFee(estimatedWithdrawFee)}
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
      ) : (
        <></>
      );
    }
    case TxType.CreateAccountDeposit:
    case TxType.Withdraw:
    case TxType.ForceExit: {
      return <></>;
    }
  }
}

export default Fee;
