const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundeMe = await ethers.getContract("FundMe", deployer)
    console.log("funding...");
    const transaction = await fundeMe.Withdraw();
    await transaction.wait(1)
    console.log("Done Done Done Alhumdulilah");
}

main().then(() => {
    process.exit(0)
}).catch((error) => {
    console.error(error)
    process.exit(1)
})