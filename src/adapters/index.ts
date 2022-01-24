import { z, ZodError } from "zod";

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
