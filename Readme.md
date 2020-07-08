# Web Wallet

## Getting Started

You need 4 different terminals to end up running:

1. A fake blockchain
2. Server spoofing
3. A Rollup operator
4. The Web Wallet livecoding server

These are the steps:

1. `ganache-cli -a 100 --defaultBalanceEther 10000 -m "hard crop gallery regular neglect weekend fatal stamp eight flock inch doll"` Leave it running
2. `node ../rollup/rollup-operator/src/server-proof.js` Leave it running
3. `cd ../rollup && truffle test ./rollup-operator/test/server/webapp-test/build-configs-UI.test.js` Move to the **rollup** repo
4. `./rollup-operator/test/server/webapp-test/create-config-env.sh`
5. `node ./rollup-operator/src/server/proof-of-burn/operator-pob.js -p passTest` Leave it running
6. `truffle test test/js/add-blocks.js` 
7. `npm run start` In the **wallet-ui** repo. Leave it running

The steps assume you have the Rollup repo in the same directory as this one and that you ran `npm install` in both.

## Refactor

- Remove Web3
- Remove Semantic UI?
- Look into reducing usage of rollup-cli and rollup-op to move to an API?
- Separate to another repo
- Add Docker for testing locally.
- Consider testing, is there time?
- Change classes to Functional components.
- Separate components from views