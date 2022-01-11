#/bin/bash

# Generate ERC20 contracts typing files
npx typechain --target ethers-v5 --out-dir src/types/contracts/erc-20 "abis/erc-20.json"

# Uncomment the following lines to generate typing files for the Hermez contracts ABIs
# git clone "git@github.com:hermeznetwork/contracts.git" "abis/hermez"
# npx typechain --target ethers-v5 --out-dir src/types/contracts/hermez "abis/hermez/compiled-contracts/*.json"
# rm -rf "abis/hermez"
