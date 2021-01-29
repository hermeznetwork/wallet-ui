# Hermez Web Wallet

## Getting Started

To set up a local blockchain with the Hermez smart contracts and a Hermez node for testing, follow these steps:

1. Clone https://github.com/hermeznetwork/integration-testing
2. `cd integration-testing && make build && make start` (Keep in mind you need to login to Docker. Ask for credentials on Keybase)

### Setting up Metamask

1. Install Metamask extension on your web browser
2. Configure the Localhost network correctly
  2.1 In Metamask go to Settings => Networks
  2.2 Select Localhost 8545
  2.3 Change the Chain Id to `0x7a69`
3. Select the Localhost network
4. Import an account with the seed phrase: `explain tackle mirror kit van hammer degree position ginger unfair soup bonus`
5. Find registered tokens in [http://localhost:8086/tokens](http://localhost:8086/tokens). For each registered token except for the first one (it's ETH):
  5.1 Select Custom Token tab and introduce the `ethereumAddress` as Token Contract Address. The rest of the fields will auto-populate
7. Sign into **wallet-ui** using this account.

#### Reset nonce

Everytime you re-run the sandbox, you need to reset your nonce in Metamask. To do so:

1. Click on your account icon
2. Settings => Advanced
3. Reset Account

## Deployment

The Hermez Web Wallet is deployed to an AWS EC2 instance using AWS ECS. A new version will be deployed automatically thanks to the `aws` GitHub action on each release. The full deployment process is:

1. Create a new release.
2. A `.env` for the production environment will be created. Values will be read from GitHub `secrets`.
3. Two new docker images for the release will be created and pushed to Docker Hub.
   1. `hermeznet/wallet-ui:${{tag_name}}`: Useful to mantain a release history just in case we need to rollback to a specific release.
   2. `hermeznet/wallet-ui:latest`: Image which is going to be deployed to AWS.
4. AWS ECS will be updated using the `ecs-task-definition.json` Task Definition which is going to pull the new Docker image to the EC2 instance.
