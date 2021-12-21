/// <reference types="react-scripts" />

import { BaseProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum?: BaseProvider;
  }
}
