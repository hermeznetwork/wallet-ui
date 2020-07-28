# Web Wallet

## Getting Started

The steps assume you have the Rollup repo in the same directory as this one and that you ran `npm install` in both. The Rollup repo should be in the *metamask* branch.

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

### Set up Metamask

1. Create a normal Metamask account.
2. Import this private key from Ganache: `0xe9693c57e65070578fbe61581e98dd68121d1ee80f5073a15ba8404a2f135837`. It includes Ether and some tokens.
3. In Metamask, you need to add 2 token smart contracts to be able to see them in the Metamask UI. These are found in the `rollup` repo in `rollup-operator/test/config/test-pob.json` after running the steps above. From there you need to find the addressess under `tokenAddress` and `tokenAddress2`.
4. Sign into **wallet-ui** using this imported account.


