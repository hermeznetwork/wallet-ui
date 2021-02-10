import { TxType } from '@hermeznetwork/hermezjs/src/enums'

function getTransactionAmount (transaction) {
  if (!transaction) {
    return undefined
  }

  if (!transaction.L1Info) {
    return transaction.amount
  } else {
    if (transaction.type === TxType.Deposit || transaction.type === TxType.CreateAccountDeposit) {
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
