import { z } from "zod";

import { StrictSchema } from "src/utils/type-safety";

export * as hermezApi from "src/persistence/hermez-api";
export * as hermezWeb from "src/persistence/hermez-web";
export * as localStorage from "src/persistence/local-storage";
export * as priceUpdater from "src/persistence/price-updater";

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
