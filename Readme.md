# Web Wallet

## Getting Started

To set up a local blockchain with the Hermez smart contracts for testing, follow these steps:

1. Clone https://github.com/hermeznetwork/contracts
2. `cd contracts && git checkout feature/fe-tools && npm i`
3. Follow steps in https://github.com/hermeznetwork/contracts/blob/feature/fe-tools/scripts/fe-deploymentTest/readme.md

### Set up Metamask

1. Install Metamask extension on your web browser
2. Configure the Localhost network correctly
  2.1 In Metamask go to Settings => Networks
  2.2 Select Localhost 8545
  2.3 Change the Chain Id to `0x7a69`
3. Select the Localhost network
4. Create an account
5. Select Custom Token tab and introduce this Token Contract Address `0xf784709d2317D872237C4bC22f867d1BAe2913AB`, introduce any token symbol and set the Decimals of Precision to `18`.
6. Repeat step 6 with the following Token Contact Address `0x3619DbE27d7c1e7E91aA738697Ae7Bc5FC3eACA5`
7. Sign into **wallet-ui** using this account.


