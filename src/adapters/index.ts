import { z, ZodError, ZodIssue } from "zod";

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

export function parseError(error: unknown, prefixMsg?: string): string {
  if (typeof error === "string") {
    return prefixMsg ? `${prefixMsg}. ${error}` : error;
  } else if (error instanceof ZodError) {
    const decodingIssues = parseDecodingError(error).join(". ");
    return prefixMsg ? `${prefixMsg}. ${decodingIssues}` : decodingIssues;
  } else if (error instanceof Error) {
    return prefixMsg ? `${prefixMsg}. ${error.message}` : error.message;
  } else {
    const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
    if (parsedMessageKeyError.success) {
      return prefixMsg
        ? `${prefixMsg}. ${parsedMessageKeyError.data.message}`
        : parsedMessageKeyError.data.message;
    } else {
      return prefixMsg ? prefixMsg : `An unknown error has occurred: ${JSON.stringify(error)}`;
    }
  }
}

export function parseDecodingError(error: ZodError): string[] {
  return parseDecodingIssues(error.issues);
}

export function parseDecodingIssues(issues: ZodIssue[]): string[] {
  return issues.reduce((accIssueMsgs: string[], currIssue: ZodIssue): string[] => {
    switch (currIssue.code) {
      case "invalid_union": {
        const unionMsgs = currIssue.unionErrors.reduce(
          (accErrorMsgs: string[], currError: ZodError) => [
            ...accErrorMsgs,
            ...parseDecodingError(currError),
          ],
          []
        );
        return [...accIssueMsgs, ...unionMsgs];
      }
      default: {
        const msg = `Decoding issue: ${currIssue.message} at path ${currIssue.path.join(".")}`;
        return [...accIssueMsgs, msg];
      }
    }
  }, []);
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
