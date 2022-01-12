# Polygon Hermez Web Wallet

Polygon Hermez Wallet provides a simple UI to get started with the Polygon Hermez Network. It supports depositing, transferring, and withdrawing ETH and ERC-20 tokens in Polygon Hermez.

To learn more, visit [the documentation](https://docs.hermez.io/#/users/hermez-wallet).

## Installation

Clone the repo:

```sh
git clone git@github.com:hermeznetwork/wallet-ui.git
```

Move into the project directory:

```sh
cd wallet-ui
```

Install project dependencies:

```sh
npm install
```

Install git pre-commit hook (required since `husky` v7, see why in [this article](https://blog.typicode.com/husky-git-hooks-autoinstall)):

```sh
npm run prepare
```

Create the required `.env` file from the example provided in the repo:

```sh
cp .env.example .env
```

## Contract interaction from Typescript

The installation process of this application takes care of creating the static typing files and factory required for Typescript to interact with the ERC-20 ABI.
The types are created using [TypeChain](https://github.com/dethcrypto/TypeChain) in the `postinstallation` step, from the JSON ABI file, and the output
files are stored in the path `src/types/contracts`.

> :warning: The typing files and factory required to interact with the Polygon Hermez contracts ABIs may be created by uncommenting the related section in the script `src/generate-contract-types.sh` and running `npm run generate-contract-types` or `npm i`.

Once the typing files are built, you can instantiate a typed contract using its factory as follows:

```typescript
import { Erc20__factory } from "src/types/contracts/erc-20/factories/Erc20__factory";
const contract = Erc20__factory.connect(ethereumAddress, provider);
```

## License

`wallet-ui` is part of the Polygon Hermez project copyright 2021 HermezDAO and published with AGPL-3 license. Please check the LICENSE file for more details.

