import { CurrencySymbol } from './utils/currencies'

export const MY_ACCOUNT = {
  PREFERRED_CURRENCY_KEY: 'preferredCurrency',
  DEFAULT_PREFERRED_CURRENCY: CurrencySymbol.USD.code
}

export const MY_CODE = {
  QR_CODE_SIZE: 216
}

export const ACCOUNT_INDEX_SEPARATOR = ':'

export const SNACKBAR_AUTO_HIDE_DURATION = 5000

export const AUTH_MESSAGE = 'HERMEZ_ACCOUNT. Don\'t share this signature with anyone as this would reveal your Hermez private key. Unless you are in a trusted application, DO NOT SIGN THIS'

export const ETHER_TOKEN_ID = 0

export const MAX_DECIMALS_UNTIL_ZERO_AMOUNT = 6

export const PENDING_WITHDRAWS_KEY = 'pendingWithdraws'

export const PENDING_DELAYED_WITHDRAWS_KEY = 'pendingDelayedWithdraws'

export const ACCOUNT_AUTH_KEY = 'accountAuth'

export const ACCOUNT_AUTH_SIGNATURE_KEY = 'accountAuthSignature'
