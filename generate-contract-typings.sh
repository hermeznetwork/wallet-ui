#/bin/bash

# Generate ERC20 contracts typing files
npx typechain --target ethers-v5 --out-dir src/contract-typings/erc20 "contracts/erc20/erc20.json"

# Uncomment the following lines to generate typing files for Hermez contracts
# git clone "git@github.com:hermeznetwork/contracts.git" "contracts/hermez"
# npx typechain --target ethers-v5 --out-dir src/contract-typings/hermez "contracts/hermez/compiled-contracts/*.json"
# rm -rf "contracts/hermez"
