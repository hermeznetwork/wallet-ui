import { CurrencySymbol } from './utils/currencies'

export const MY_ACCOUNT = {
  PREFERRED_CURRENCY_KEY: 'preferredCurrency',
  DEFAULT_PREFERRED_CURRENCY: CurrencySymbol.USD.code
}

export const FIAT_EXCHANGE_RATES_API_URL = 'https://api.exchangeratesapi.io'

export const MY_CODE = {
  QR_CODE_SIZE: 216
}

export const ACCOUNT_INDEX_SEPARATOR = ':'

export const SNACKBAR_AUTO_HIDE_DURATION = 3500

export const ETHER_TOKEN_ID = 0

export const MAX_TOKEN_DECIMALS = 6

export const PENDING_WITHDRAWS_KEY = 'pendingWithdraws'

export const PENDING_DELAYED_WITHDRAWS_KEY = 'pendingDelayedWithdraws'

export const PENDING_DEPOSITS_KEY = 'pendingDeposits'

export const ACCOUNT_AUTH_SIGNATURES_KEY = 'accountAuthSignatures'

export const TREZOR_MANIFEST_MAIL = 'hello@hermez.io'

export const PRIVACY_POLICY_URL = 'https://hermez.io/privacy-policy'

export const TERMS_OF_SERVICE_URL = 'https://hermez.io/terms-of-service'

export const AUTO_REFRESH_RATE = 60000 // 1min
