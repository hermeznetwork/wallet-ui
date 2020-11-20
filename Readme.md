# Hermez Web Wallet

## Getting Started

To set up a local blockchain with the Hermez smart contracts for testing, follow these steps:

1. Clone https://github.com/hermeznetwork/contracts
2. `cd contracts && git checkout feature/fe-tools && npm i`
3. Follow steps in https://github.com/hermeznetwork/contracts/blob/feature/fe-tools/scripts/fe-deploymentTest/readme.md

### Setting up Metamask

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

## Deployment

The Hermez Web Wallet is deployed to an AWS EC2 instance using AWS ECS. A new version would be deployed automatically thanks to the `aws` GitHub action on each release. The full deployment process is:

1. Create a new release.
2. A `.env` for the production environment would be created. Values would be read from GitHub `secrets`.
3. Two new docker images for the release would be created and pushed to Docker Hub.
   1. `hermeznet/wallet-ui:${{tag_name}}`: Useful to mantain a release history just in case we need to rollback to a specific release.
   2. `hermeznet/wallet-ui:latest`: Image which is going to be deployed to AWS.
4. AWS ECS would be updated using the `ecs-task-definition.json` Task Definition which is going to pull the new Docker image on the EC2 instance.
