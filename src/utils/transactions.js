import { TxType } from '@hermeznetwork/hermezjs/src/tx-utils'

function getTransactionAmount (transaction) {
  if (!transaction) {
    return undefined
  }

  if (!transaction.L1Info) {
    return transaction.amount
  } else {
    if (transaction.type === TxType.Deposit) {
      return transaction.L1Info.depositAmountSuccess
        ? transaction.L1Info.depositAmount
        : '0'
    } else {
      return transaction.L1Info.amountSuccess
        ? transaction.amount
        : '0'
    }
  }
}

export {
  getTransactionAmount
}
