import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Stokvel Token...");

  const StokvelToken = await ethers.getContractFactory("StokvelToken");
  const token = await StokvelToken.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log(`Stokvel Token deployed to: ${address}`);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await token.deploymentTransaction()?.wait(5);

  console.log("Deployment completed!");
  console.log("Token details:");
  console.log(`- Name: ${await token.name()}`);
  console.log(`- Symbol: ${await token.symbol()}`);
  console.log(`- Total Supply: ${await token.getTotalSupply()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });