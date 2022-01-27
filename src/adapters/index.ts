import { z, ZodError } from "zod";
import * as StackTrace from "stacktrace-js";

import { StrictSchema } from "src/utils/type-safety";

export * as hermezApi from "src/adapters/hermez-api";
export * as hermezWeb from "src/adapters/hermez-web";
export * as localStorage from "src/adapters/local-storage";
export * as priceUpdater from "src/adapters/price-updater";
export * as ethereum from "src/adapters/ethereum";
export * as env from "src/adapters/env";

// Error decoding and message extraction helper
interface MessageKeyError {
  message: string;
}

const messageKeyErrorParser = StrictSchema<MessageKeyError>()(
  z.object({
    message: z.string(),
  })
);

interface MetamaskUserRejectedRequestError {
  code: 4001;
  message: string;
}

const metamaskUserRejectedRequestError = StrictSchema<MetamaskUserRejectedRequestError>()(
  z.object({
    code: z.literal(4001),
    message: z.string(),
  })
);

export function isMetamaskUserRejectedRequestError(
  error: unknown
): error is MetamaskUserRejectedRequestError {
  return metamaskUserRejectedRequestError.safeParse(error).success;
}

export function parseError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  } else if (error instanceof Error) {
    const selectMultipleTabsAndSpaces = /[^\S\r\n]{2,}/g;
    const maxStackLength = 4096;
    return [
      JSON.stringify(error),
      ...(error.stack
        ? [
            ">>>>>>>>>> error.stack >>>>>>>>>>",
            error.stack.replaceAll(selectMultipleTabsAndSpaces, " ").substring(0, maxStackLength),
          ]
        : []),
    ].join("\n");
  } else {
    const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
    if (parsedMessageKeyError.success) {
      return parsedMessageKeyError.data.message;
    } else {
      return `An unknown error has occurred: ${JSON.stringify(error)}`;
    }
  }
}

export function asyncParseError(error: unknown): Promise<string> {
  if (typeof error === "string") {
    return Promise.resolve(error);
  } else if (error instanceof Error) {
    const maxStackLength = 4096;
    return StackTrace.fromError(error)
      .then((stackframes) =>
        [
          JSON.stringify(error),
          ">>>>>>>>>> stackframes >>>>>>>>>>",
          ...stackframes.map((sf) => sf.toString()),
        ]
          .join("\n")
          .substring(0, maxStackLength)
      )
      .catch(asyncParseError);
  } else {
    const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
    if (parsedMessageKeyError.success) {
      return Promise.resolve(parsedMessageKeyError.data.message);
    } else {
      return Promise.resolve(`An unknown error has occurred: ${JSON.stringify(error)}`);
    }
  }
}

export function logDecodingError<T>(error: ZodError<T>, details: string): void {
  error.errors.forEach((issue) => {
    switch (issue.code) {
      case "invalid_union": {
        issue.unionErrors.forEach((e) => logDecodingError(e, details));
        break;
      }
      default: {
        console.error(`A decoding error occurred: ${details}`);
        console.error(JSON.stringify(issue, null, 4));
        break;
      }
    }
  });
}
