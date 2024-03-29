import { z, ZodError } from "zod";
import * as StackTrace from "stacktrace-js";
import axios from "axios";

import { StrictSchema } from "src/utils/type-safety";

// Error decoding and message extraction helper
interface MessageKeyError {
  message: string;
}

const messageKeyErrorParser = StrictSchema<MessageKeyError>()(
  z.object({
    message: z.string(),
  })
);

export interface MetamaskUserRejectedRequestError {
  code: 4001;
  message: string;
}

export const metamaskUserRejectedRequestError = StrictSchema<MetamaskUserRejectedRequestError>()(
  z.object({
    code: z.literal(4001),
    message: z.string(),
  })
);

function sanitizeErrorMessage(errorMessage: string): string {
  try {
    return JSON.stringify(JSON.parse(errorMessage));
  } catch (error) {
    const selectMultipleTabsAndSpaces = /[^\S\r\n]{2,}/g;
    return errorMessage.replaceAll(selectMultipleTabsAndSpaces, " ");
  }
}

export function parseError(error: unknown): Promise<string> {
  const unknownError = Promise.resolve(`An unknown error has occurred: ${JSON.stringify(error)}`);
  if (typeof error === "string") {
    return Promise.resolve(error);
  } else if (error instanceof Error) {
    const maxErrorLength = 4096;
    return StackTrace.fromError(error)
      .then((stackframes) =>
        [
          sanitizeErrorMessage(error.message),
          ">>>>>>>>>> Stringification >>>>>>>>>>",
          JSON.stringify(error),
          ">>>>>>>>>> Stack >>>>>>>>>>",
          ...stackframes.map((sf) => sf.toString()),
        ]
          .join("\n")
          .substring(0, maxErrorLength)
      )
      .catch((e) => {
        console.error(e);
        return unknownError;
      });
  } else {
    const parsedMessageKeyError = messageKeyErrorParser.safeParse(error);
    if (parsedMessageKeyError.success) {
      return Promise.resolve(parsedMessageKeyError.data.message);
    } else {
      console.error(error);
      return unknownError;
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

export function isAxiosCancelRequestError(error: unknown): boolean {
  return axios.isCancel(error);
}
