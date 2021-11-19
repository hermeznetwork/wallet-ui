import React from "react";
import PropTypes from "prop-types";

import Exit from "../exit/exit.view";
import {
  getFixedTokenAmount,
  getAmountInPreferredCurrency,
  getTokenAmountInPreferredCurrency,
} from "../../../utils/currencies";

function ExitList({
  transactions,
  preferredCurrency,
  fiatExchangeRates,
  babyJubJub,
  pendingWithdraws,
  pendingDelayedWithdraws,
  availableWithdraws,
  coordinatorState,
  onAddPendingDelayedWithdraw,
  onRemovePendingDelayedWithdraw,
  onAddAvailableWithdraw,
  onRemoveAvailableWithdraw,
}) {
  return (
    <>
      {transactions.map((transaction) => {
        const amount = transaction.amount || transaction.balance;
        const fixedTokenAmount = getFixedTokenAmount(amount, transaction.token.decimals);

        return (
          <Exit
            key={transaction.id || transaction.itemId}
            amount={amount}
            fixedTokenAmount={fixedTokenAmount}
            token={transaction.token}
            fiatAmount={
              transaction.historicUSD
                ? getAmountInPreferredCurrency(
                    transaction.historicUSD,
                    preferredCurrency,
                    fiatExchangeRates
                  )
                : getTokenAmountInPreferredCurrency(
                    fixedTokenAmount,
                    transaction.token.USD,
                    preferredCurrency,
                    fiatExchangeRates
                  )
            }
            preferredCurrency={preferredCurrency}
            batchNum={transaction.batchNum}
            exitId={transaction.accountIndex + transaction.batchNum}
            merkleProof={transaction.merkleProof}
            accountIndex={transaction.accountIndex || transaction.fromAccountIndex}
            babyJubJub={babyJubJub}
            pendingWithdraws={pendingWithdraws}
            pendingDelayedWithdraws={pendingDelayedWithdraws}
            onAddPendingDelayedWithdraw={onAddPendingDelayedWithdraw}
            onRemovePendingDelayedWithdraw={onRemovePendingDelayedWithdraw}
            availableWithdraws={availableWithdraws}
            onAddAvailableWithdraw={onAddAvailableWithdraw}
            onRemoveAvailableWithdraw={onRemoveAvailableWithdraw}
            coordinatorState={coordinatorState}
          />
        );
      })}
    </>
  );
}

ExitList.propTypes = {
  transactions: PropTypes.array,
  preferredCurrency: PropTypes.string.isRequired,
  fiatExchangeRates: PropTypes.object,
  pendingWithdraws: PropTypes.array,
  pendingDelayedWithdraws: PropTypes.array,
  availableWithdraws: PropTypes.array,
  coordinatorState: PropTypes.object,
  onAddPendingDelayedWithdraw: PropTypes.func.isRequired,
  onRemovePendingDelayedWithdraw: PropTypes.func.isRequired,
  onAddAvailableWithdraw: PropTypes.func.isRequired,
  onRemoveAvailableWithdraw: PropTypes.func.isRequired,
};

export default ExitList;
