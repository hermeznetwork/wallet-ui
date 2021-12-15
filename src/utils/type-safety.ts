import { ZodSchema } from "zod";

import { Exactly } from "./types";

export const EnsureSchema: <T>() => <U>(
  u: Exactly<ZodSchema<T>, ZodSchema<U>> extends true ? ZodSchema<U> : never
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
) => ZodSchema<T> = () => (u) => u as any;
