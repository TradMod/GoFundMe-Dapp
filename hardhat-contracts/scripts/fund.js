const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log('Funding Contract.....')
    const transaction = await fundMe.Fund({ value: ethers.utils.parseEther('5'), })
    await transaction.wait(1);
    console.log('Contract Deployed')
}

main().then(() => {
    process.exit(0)
}).catch((error) => {
    console.error(error)
    process.exit(1)
})