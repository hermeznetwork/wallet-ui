import axios from "axios";
import { z } from "zod";

// domain
import { Env, FiatExchangeRates, Token } from "src/domain";
// adapters
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
function getTokensPrice(env: Env): Promise<Token[]> {
  const client = axios.create({
    baseURL: env.REACT_APP_PRICE_UPDATER_API_URL,
    headers: { "X-API-KEY": env.REACT_APP_PRICE_UPDATER_API_KEY },
  });
  return client.get(`${env.REACT_APP_PRICE_UPDATER_API_URL}/v1/tokens`).then(({ data }) => {
    const parsedgGetTokensPriceResponse = getTokensPriceResponseParser.safeParse(data);
    if (parsedgGetTokensPriceResponse.success) {
      return parsedgGetTokensPriceResponse.data.tokens;
    } else {
      return Promise.reject(parsedgGetTokensPriceResponse.error);
    }
  });
}

/**
 * Fetches the USD exchange rates for the requested currency symbols
 */
function getFiatExchangeRates(symbols: string[], env: Env): Promise<FiatExchangeRates> {
  const params = { base: CurrencySymbol.USD.code, symbols: symbols.join("|") };
  const client = axios.create({
    baseURL: env.REACT_APP_PRICE_UPDATER_API_URL,
    headers: { "X-API-KEY": env.REACT_APP_PRICE_UPDATER_API_KEY },
  });
  return client
    .get(`${env.REACT_APP_PRICE_UPDATER_API_URL}/v1/currencies`, { params })
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
}

export { getFiatExchangeRates, getTokensPrice };
