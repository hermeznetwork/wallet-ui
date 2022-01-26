import { z } from "zod";

// utils
import { StrictSchema } from "src/utils/type-safety";
// domain
import {
  InvalidInputError,
  ResourceNotFoundError,
  ResourceUnavailableError,
  TransactionRejectedError,
  MethodNotSupportedError,
  LimitExceededError,
  ParseError,
  InvalidRequestError,
  MethodNotFoundError,
  InvalidParamsError,
  InternalError,
  UserRejectedRequestError,
  UnauthorizedError,
  UnsupportedMethodError,
  DisconnectedError,
  ChainDisconnectedError,
  MetamaskError,
} from "src/domain";

const invalidInputError = StrictSchema<Omit<InvalidInputError, "type">>()(
  z.object({
    code: z.literal(-32000),
    message: z.string(),
  })
);

const resourceNotFoundError = StrictSchema<Omit<ResourceNotFoundError, "type">>()(
  z.object({
    code: z.literal(-32001),
    message: z.string(),
  })
);

const resourceUnavailableError = StrictSchema<Omit<ResourceUnavailableError, "type">>()(
  z.object({
    code: z.literal(-32002),
    message: z.string(),
  })
);

const transactionRejectedError = StrictSchema<Omit<TransactionRejectedError, "type">>()(
  z.object({
    code: z.literal(-32003),
    message: z.string(),
  })
);

const methodNotSupportedError = StrictSchema<Omit<MethodNotSupportedError, "type">>()(
  z.object({
    code: z.literal(-32004),
    message: z.string(),
  })
);

const limitExceededError = StrictSchema<Omit<LimitExceededError, "type">>()(
  z.object({
    code: z.literal(-32005),
    message: z.string(),
  })
);

const parseError = StrictSchema<Omit<ParseError, "type">>()(
  z.object({
    code: z.literal(-32700),
    message: z.string(),
  })
);

const invalidRequestError = StrictSchema<Omit<InvalidRequestError, "type">>()(
  z.object({
    code: z.literal(-32600),
    message: z.string(),
  })
);

const methodNotFoundError = StrictSchema<Omit<MethodNotFoundError, "type">>()(
  z.object({
    code: z.literal(-32601),
    message: z.string(),
  })
);

const invalidParamsError = StrictSchema<Omit<InvalidParamsError, "type">>()(
  z.object({
    code: z.literal(-32602),
    message: z.string(),
  })
);

const internalError = StrictSchema<Omit<InternalError, "type">>()(
  z.object({
    code: z.literal(-32603),
    message: z.string(),
  })
);

const userRejectedRequestError = StrictSchema<Omit<UserRejectedRequestError, "type">>()(
  z.object({
    code: z.literal(4001),
    message: z.string(),
  })
);

const unauthorizedError = StrictSchema<Omit<UnauthorizedError, "type">>()(
  z.object({
    code: z.literal(4100),
    message: z.string(),
  })
);

const unsupportedMethodError = StrictSchema<Omit<UnsupportedMethodError, "type">>()(
  z.object({
    code: z.literal(4200),
    message: z.string(),
  })
);

const disconnectedError = StrictSchema<Omit<DisconnectedError, "type">>()(
  z.object({
    code: z.literal(4900),
    message: z.string(),
  })
);

const chainDisconnectedError = StrictSchema<Omit<ChainDisconnectedError, "type">>()(
  z.object({
    code: z.literal(4901),
    message: z.string(),
  })
);

const metamaskError = StrictSchema<Omit<MetamaskError, "type">>()(
  z.union([
    invalidInputError,
    resourceNotFoundError,
    resourceUnavailableError,
    transactionRejectedError,
    methodNotSupportedError,
    limitExceededError,
    parseError,
    invalidRequestError,
    methodNotFoundError,
    invalidParamsError,
    internalError,
    userRejectedRequestError,
    unauthorizedError,
    unsupportedMethodError,
    disconnectedError,
    chainDisconnectedError,
  ])
).transform(({ code, message }) => {
  switch (code) {
    case -32000: {
      const invalidInputError: InvalidInputError = {
        type: "invalidInputError",
        code,
        message,
      };
      return invalidInputError;
    }
    case -32001: {
      const resourceNotFoundError: ResourceNotFoundError = {
        type: "resourceNotFoundError",
        code,
        message,
      };
      return resourceNotFoundError;
    }
    case -32002: {
      const resourceUnavailableError: ResourceUnavailableError = {
        type: "resourceUnavailableError",
        code,
        message,
      };
      return resourceUnavailableError;
    }
    case -32003: {
      const transactionRejectedError: TransactionRejectedError = {
        type: "transactionRejectedError",
        code,
        message,
      };
      return transactionRejectedError;
    }
    case -32004: {
      const methodNotSupportedError: MethodNotSupportedError = {
        type: "methodNotSupportedError",
        code,
        message,
      };
      return methodNotSupportedError;
    }
    case -32005: {
      const limitExceededError: LimitExceededError = {
        type: "limitExceededError",
        code,
        message,
      };
      return limitExceededError;
    }
    case -32700: {
      const parseError: ParseError = {
        type: "parseError",
        code,
        message,
      };
      return parseError;
    }
    case -32600: {
      const invalidRequestError: InvalidRequestError = {
        type: "invalidRequestError",
        code,
        message,
      };
      return invalidRequestError;
    }
    case -32601: {
      const methodNotFoundError: MethodNotFoundError = {
        type: "methodNotFoundError",
        code,
        message,
      };
      return methodNotFoundError;
    }
    case -32602: {
      const invalidParamsError: InvalidParamsError = {
        type: "invalidParamsError",
        code,
        message,
      };
      return invalidParamsError;
    }
    case -32603: {
      const internalError: InternalError = {
        type: "internalError",
        code,
        message,
      };
      return internalError;
    }
    case 4001: {
      const userRejectedRequestError: UserRejectedRequestError = {
        type: "userRejectedRequestError",
        code,
        message,
      };
      return userRejectedRequestError;
    }
    case 4100: {
      const unauthorizedError: UnauthorizedError = {
        type: "unauthorizedError",
        code,
        message,
      };
      return unauthorizedError;
    }
    case 4200: {
      const unsupportedMethodError: UnsupportedMethodError = {
        type: "unsupportedMethodError",
        code,
        message,
      };
      return unsupportedMethodError;
    }
    case 4900: {
      const disconnectedError: DisconnectedError = {
        type: "disconnectedError",
        code,
        message,
      };
      return disconnectedError;
    }
    case 4901: {
      const chainDisconnectedError: ChainDisconnectedError = {
        type: "chainDisconnectedError",
        code,
        message,
      };
      return chainDisconnectedError;
    }
  }
});

export { metamaskError };
