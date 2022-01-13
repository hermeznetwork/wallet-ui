import { z, ZodError } from "zod";

import { StrictSchema } from "src/utils/type-safety";

export * as hermezApi from "src/adapters/hermez-api";
export * as hermezWeb from "src/adapters/hermez-web";
export * as localStorage from "src/adapters/local-storage";
export * as priceUpdater from "src/adapters/price-updater";
export * as ethereum from "src/adapters/ethereum";

// Error decoding and message extraction helper
interface MessageKeyError {
  message: string;
}

const messageKeyErrorParser = StrictSchema<MessageKeyError>()(
  z.object({
    message: z.string(),
  })
);

export function getErrorMessage(error: unknown, defaultMsg?: string): string {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
  if (parsedMessageKeyError.success) {
    return parsedMessageKeyError.data.message;
  }
  if (defaultMsg !== undefined) {
    return defaultMsg;
  }
  return "An unknown error occurred";
}

export function logDecodingError<T>(error: ZodError<T>, details: string): void {
  const message =
    error.issues.length > 1
      ? `Some errors occurred while decoding. ${details}`
      : `An error occurred while decoding. ${details}`;
  console.error(message);
  error.issues.forEach((issue) => {
    console.error(JSON.stringify(issue, null, 4));
  });
}
