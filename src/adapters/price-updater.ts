import axios from "axios";
import { z } from "zod";

// domain
import { FiatExchangeRates, Token } from "src/domain";
// adapters
import * as adapters from "src/adapters";
import * as parsers from "src/adapters/parsers";
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

/**
 * Returns a list of tokens with usd price.
 */
function getTokensPrice(): Promise<Token[]> {
  const eitherEnv = adapters.env.getEnv();
  if (eitherEnv.success) {
    const client = axios.create({
      baseURL: eitherEnv.data.REACT_APP_PRICE_UPDATER_API_URL,
      headers: { "X-API-KEY": eitherEnv.data.REACT_APP_PRICE_UPDATER_API_KEY },
    });
    return client
      .get(`${eitherEnv.data.REACT_APP_PRICE_UPDATER_API_URL}/v1/tokens`)
      .then(({ data }) => {
        const parsedgGetTokensPriceResponse = getTokensPriceResponseParser.safeParse(data);
        if (parsedgGetTokensPriceResponse.success) {
          return parsedgGetTokensPriceResponse.data.tokens;
        } else {
          return Promise.reject(parsedgGetTokensPriceResponse.error);
        }
      });
  } else {
    return Promise.reject(eitherEnv.error);
  }
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 */
function getFiatExchangeRates(symbols: string[]): Promise<FiatExchangeRates> {
  const eitherEnv = adapters.env.getEnv();
  if (eitherEnv.success) {
    const params = { base: CurrencySymbol.USD.code, symbols: symbols.join("|") };
    const client = axios.create({
      baseURL: eitherEnv.data.REACT_APP_PRICE_UPDATER_API_URL,
      headers: { "X-API-KEY": eitherEnv.data.REACT_APP_PRICE_UPDATER_API_KEY },
    });
    return client
      .get(`${eitherEnv.data.REACT_APP_PRICE_UPDATER_API_URL}/v1/currencies`, { params })
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
          return Promise.reject(parsedFiatExchangeRates.error);
        }
      });
  } else {
    return Promise.reject(eitherEnv.error);
  }
}

export { getFiatExchangeRates, getTokensPrice };
