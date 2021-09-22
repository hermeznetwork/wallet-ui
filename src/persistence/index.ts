/**
 * HermezJS type definitions have been moved to the dedicated definitions file hermezjs-typings.d.ts
 * We may decide not to export them from the persistence and let other layers import them from the lib.
 */
import { AxiosError } from "axios";
import * as z from "zod";
import hermez from "@hermeznetwork/hermezjs";
import { HttpStatusCode } from "src/utils/http";

export type { Transactions, Exits, Accounts } from "@hermeznetwork/hermezjs";
export interface PostCreateAccountAuthorizationError {
  message: string;
  code: number;
  type: string;
}

const postCreateAccountAuthorizationErrorParser: z.ZodSchema<PostCreateAccountAuthorizationError> =
  z.object({
    message: z.string(),
    code: z.number(),
    type: z.string(),
  });

export function postCreateAccountAuthorization(
  hermezEthereumAddress: string,
  publicKeyBase64: string,
  signature: string,
  nextForgerUrls: string[]
): Promise<unknown> {
  return hermez.CoordinatorAPI.postCreateAccountAuthorization(
    hermezEthereumAddress,
    publicKeyBase64,
    signature,
    nextForgerUrls
  ).catch((error: AxiosError<PostCreateAccountAuthorizationError>) => {
    // If the coordinators already have the CreateAccountsAuth signature,
    // we ignore the error
    if (error.response?.status !== HttpStatusCode.DUPLICATED) {
      console.log(error);
      throw error;
    }
    const parsedErrorResponse = postCreateAccountAuthorizationErrorParser.safeParse(error.response);
    if (parsedErrorResponse.success) {
      const errorMessage =
        parsedErrorResponse.data.code === -32603
          ? "Sorry, hardware wallets are not supported in Hermez yet"
          : error.message;
      throw new Error(errorMessage);
    } else {
      throw new Error("Oops... An unknown error occurred while creating the account authorization");
    }
  });
}
