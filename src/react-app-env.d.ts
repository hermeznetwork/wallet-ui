/// <reference types="react-scripts" />

import { BaseProvider } from "@ethersproject/providers";
declare global {
  type WindowOverride = Window &
    typeof globalThis & {
      ethereum?: BaseProvider;
    };
}
