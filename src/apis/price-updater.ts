import axios from "axios";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

import { CurrencySymbol } from "src/utils/currencies";

// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";

const ajv = new Ajv();

// string validation for env vars
const stringSchema: JTDSchemaType<string> = { type: "string" };
const stringValidator = ajv.compile(stringSchema);

// token validation
const tokenSchema: JTDSchemaType<Token> = {
  properties: {
    decimals: { type: "int32" },
    ethereumAddress: { type: "string" },
    ethereumBlockNum: { type: "int32" },
    fiatUpdate: { type: "string" },
    id: { type: "int32" },
    itemId: { type: "int32" },
    name: { type: "string" },
    symbol: { type: "string" },
    USD: { type: "int32" },
  },
};
const tokenListSchema: JTDSchemaType<Token[]> = {
  elements: tokenSchema,
};

interface GetTokensPriceResponse {
  tokens: Token[];
}

const getTokensPriceResponseSchema: JTDSchemaType<GetTokensPriceResponse> = {
  properties: {
    tokens: tokenListSchema,
  },
};

const getTokensPriceResponseValidator = ajv.compile(getTokensPriceResponseSchema);

// api exchange rates validation
interface ApiExchangeRate {
  currency: string;
  price: number;
}

const apiExchangeRateSchema: JTDSchemaType<ApiExchangeRate> = {
  properties: {
    currency: { type: "string" },
    price: { type: "int32" },
  },
};
const apiExchangeRateListSchema: JTDSchemaType<ApiExchangeRate[]> = {
  elements: apiExchangeRateSchema,
};

interface ApiExchangeRateResponse {
  currencies: ApiExchangeRate[];
}

const getFiatExchangeRatesResponseSchema: JTDSchemaType<ApiExchangeRateResponse> = {
  properties: {
    currencies: apiExchangeRateListSchema,
  },
};

const getFiatExchangeRatesResponseValidator = ajv.compile(getFiatExchangeRatesResponseSchema);

const mockedFiatExchangeRates = {
  EUR: 0.837775,
  CNY: 6.446304,
  JPY: 110.253954,
  GBP: 0.716945,
};

/**
 * Returns a list of tokens with usd price.>
 * @returns {Promise<Token[]>} - List of tokens
 */
function getTokensPrice(): Promise<Token[]> {
  if (
    stringValidator(process.env.REACT_APP_PRICE_UPDATER_API_URL) &&
    stringValidator(process.env.REACT_APP_PRICE_UPDATER_API_KEY)
  ) {
    const client = axios.create({
      baseURL: process.env.REACT_APP_PRICE_UPDATER_API_URL,
      headers: { "X-API-KEY": process.env.REACT_APP_PRICE_UPDATER_API_KEY },
    });
    return client
      .get(`${process.env.REACT_APP_PRICE_UPDATER_API_URL}/v1/tokens`)
      .then(({ data }) => {
        if (getTokensPriceResponseValidator(data)) {
          return data.tokens;
        } else {
          return Promise.reject(getTokensPriceResponseValidator.errors);
        }
      });
  } else {
    return Promise.reject(stringValidator.errors);
  }
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Promise<FiatExchangeRates>} - USD exchange rates for the requested symbols
 */
// eslint-disable-next-line no-unused-vars
function getFiatExchangeRates(symbols: string[]): Promise<FiatExchangeRates> {
  if (
    stringValidator(process.env.REACT_APP_PRICE_UPDATER_API_URL) &&
    stringValidator(process.env.REACT_APP_PRICE_UPDATER_API_KEY)
  ) {
    const params = { base: CurrencySymbol.USD.code, symbols: symbols.join("|") };
    const client = axios.create({
      baseURL: process.env.REACT_APP_PRICE_UPDATER_API_URL,
      headers: { "X-API-KEY": process.env.REACT_APP_PRICE_UPDATER_API_KEY },
    });
    return client
      .get(`${process.env.REACT_APP_PRICE_UPDATER_API_URL}/v1/currencies`, { params })
      .then((res) => {
        if (getFiatExchangeRatesResponseValidator(res.data)) {
          const currencies: ApiExchangeRate[] = res.data.currencies;
          return currencies.reduce(
            (acc, rate) => ({
              ...acc,
              [rate.currency]: rate.price,
            }),
            {}
          );
        } else {
          return Promise.reject(getFiatExchangeRatesResponseValidator.errors);
        }
      });
  } else {
    return Promise.reject(stringValidator.errors);
  }
}

export { mockedFiatExchangeRates, getFiatExchangeRates, getTokensPrice };
