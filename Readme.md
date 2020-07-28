# Web Wallet

## Getting Started

The steps assume you have the Rollup repo in the same directory as this one and that you ran `npm install` in rollup folder, rollup/rollup-operator folder and wallet-ui folder. The Rollup repo should be in the *metamask* branch. Check also that you have installed ganache-cli and truffle: `npm install -g ganache-cli`, `npm install -g truffle` 

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

1. Install Metamask extension on your web explorer
2. Select the Localhost network
3. Select `import using account seed phrase`
4. Add this seed phrase `hard crop gallery regular neglect weekend fatal stamp eight flock inch doll` and a new password and click Restore.
5. In Metamask, you need to add 2 token smart contracts to be able to see them in the Metamask UI. These are found in the `rollup` repo in `rollup-operator/test/config/test-pob.json` after running the steps above. From there you need to find the addressess under `tokenAddress` and `tokenAddress2`.
6. Select `Account 1` and click `Add Token`
7. Select Custom Token tab and introduce this Token Contract Address `0x7dFc5b5D172db3941f669770f9993b1df250B560`, introduce any token symbol and leave the Decimals of Precision to zero.
8. Repeat step 6 with the following Token Contact Address `0x88C20845cC5979AAc23C5ae22b8c4d93e9d04334`
9. Sign into **wallet-ui** using this imported account.


