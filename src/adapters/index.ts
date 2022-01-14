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

export function getErrorMessage(error: unknown, prefixMsg?: string): string {
  if (typeof error === "string") {
    return prefixMsg ? `${prefixMsg}. ${error}` : error;
  } else if (error instanceof ZodError) {
    const decodingIssues = error.errors
      .map((issue) => `${issue.message} at path ${issue.path.join(".")}`)
      .join(" | ");
    return prefixMsg
      ? `${prefixMsg}. Decoding issues: ${decodingIssues}`
      : `Decoding issues: ${decodingIssues}`;
  } else if (error instanceof Error) {
    return prefixMsg ? `${prefixMsg}. ${error.message}` : error.message;
  } else {
    const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
    if (parsedMessageKeyError.success) {
      return prefixMsg
        ? `${prefixMsg}. ${parsedMessageKeyError.data.message}`
        : parsedMessageKeyError.data.message;
    } else {
      return prefixMsg ? prefixMsg : "Oops... an unknown error occurred";
    }
  }
}

export function logDecodingError<T>(error: ZodError<T>, details: string): void {
  const message =
    error.issues.length > 1
      ? `Some decoding errors occurred: ${details}`
      : `A decoding error occurred: ${details}`;
  console.error(message);
  error.issues.forEach((issue) => {
    console.error(JSON.stringify(issue, null, 4));
  });
}
