import axios from "axios";
import { z } from "zod";

// domain
import { FiatExchangeRates, Token } from "src/domain/hermez";
// persistence
import * as parsers from "src/persistence/parsers";
// utils
import { CurrencySymbol } from "src/utils/currencies";
import { StrictSchema } from "src/utils/type-safety";

const tokenListParser = StrictSchema<Token[]>()(z.array(parsers.token));

interface GetTokensPriceResponse {
  tokens: Token[];
}

const getTokensPriceResponseParser = StrictSchema<GetTokensPriceResponse>()(
  z.object({
    tokens: tokenListParser,
  })
);

// api exchange rates validation
interface ApiExchangeRate {
  currency: string;
  price: number;
}

const apiExchangeRateParser = StrictSchema<ApiExchangeRate>()(
  z.object({
    currency: z.string(),
    price: z.number(),
  })
);

const apiExchangeRateListParser = StrictSchema<ApiExchangeRate[]>()(z.array(apiExchangeRateParser));

interface ApiExchangeRateResponse {
  currencies: ApiExchangeRate[];
}

const getFiatExchangeRatesResponseParser = StrictSchema<ApiExchangeRateResponse>()(
  z.object({
    currencies: apiExchangeRateListParser,
  })
);

const mockedFiatExchangeRates = {
  EUR: 0.837775,
  CNY: 6.446304,
  JPY: 110.253954,
  GBP: 0.716945,
};

const parsedReactAppPriceUpdaterApiUrl = z
  .string()
  .safeParse(process.env.REACT_APP_PRICE_UPDATER_API_URL);

const parsedReactAppPriceUpdaterApiKey = z
  .string()
  .safeParse(process.env.REACT_APP_PRICE_UPDATER_API_KEY);

/**
 * Returns a list of tokens with usd price.>
 * @returns {Promise<Token[]>} - List of tokens
 */
function getTokensPrice(): Promise<Token[]> {
  if (parsedReactAppPriceUpdaterApiUrl.success === false) {
    return Promise.reject(parsedReactAppPriceUpdaterApiUrl.error.message);
  } else if (parsedReactAppPriceUpdaterApiKey.success === false) {
    return Promise.reject(parsedReactAppPriceUpdaterApiKey.error.message);
  } else {
    const client = axios.create({
      baseURL: parsedReactAppPriceUpdaterApiUrl.data,
      headers: { "X-API-KEY": parsedReactAppPriceUpdaterApiKey.data },
    });
    return client.get(`${parsedReactAppPriceUpdaterApiUrl.data}/v1/tokens`).then(({ data }) => {
      const parsedgGetTokensPriceResponse = getTokensPriceResponseParser.safeParse(data);
      if (parsedgGetTokensPriceResponse.success) {
        return parsedgGetTokensPriceResponse.data.tokens;
      } else {
        return Promise.reject(parsedgGetTokensPriceResponse.error.message);
      }
    });
  }
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 * @param {string[]} symbols - ISO 4217 currency codes
 * @returns {Promise<FiatExchangeRates>} - USD exchange rates for the requested symbols
 */
// eslint-disable-next-line no-unused-vars
function getFiatExchangeRates(symbols: string[]): Promise<FiatExchangeRates> {
  if (parsedReactAppPriceUpdaterApiUrl.success === false) {
    return Promise.reject(parsedReactAppPriceUpdaterApiUrl.error.message);
  } else if (parsedReactAppPriceUpdaterApiKey.success === false) {
    return Promise.reject(parsedReactAppPriceUpdaterApiKey.error.message);
  } else {
    const params = { base: CurrencySymbol.USD.code, symbols: symbols.join("|") };
    const client = axios.create({
      baseURL: parsedReactAppPriceUpdaterApiUrl.data,
      headers: { "X-API-KEY": parsedReactAppPriceUpdaterApiKey.data },
    });
    return client
      .get(`${parsedReactAppPriceUpdaterApiUrl.data}/v1/currencies`, { params })
      .then((res) => {
        const parsedFiatExchangeRates = getFiatExchangeRatesResponseParser.safeParse(res.data);
        if (parsedFiatExchangeRates.success) {
          const currencies: ApiExchangeRate[] = parsedFiatExchangeRates.data.currencies;
          return currencies.reduce(
            (acc, rate) => ({
              ...acc,
              [rate.currency]: rate.price,
            }),
            {}
          );
        } else {
          return Promise.reject(parsedFiatExchangeRates.error.message);
        }
      });
  }
}

export { mockedFiatExchangeRates, getFiatExchangeRates, getTokensPrice };
