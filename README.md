# Hermez Web Wallet

Hermez Wallet provides a simple UI to get started with the Hermez Network. It supports depositing, transferring, and withdrawing ETH and ERC-20 tokens in Hermez.

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

## License

`wallet-ui` is part of the Hermez project copyright 2021 HermezDAO and published with AGPL-3 license. Please check the LICENSE file for more details.

