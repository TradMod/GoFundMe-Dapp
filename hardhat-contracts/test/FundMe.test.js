const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", function () {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    // let valueAmount = 1000000000000000000;
    let valueAmount = ethers.utils.parseEther("1");

    beforeEach(async function () {
        deployer = await (getNamedAccounts()).deployer;
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", async function () {
        it("Aggregator addresses are set correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe('Fund', async function () {
        it("If ETH not enough, Fail!", async function () {
            await expect(fundMe.Fund()).to.be.reverted;
        })
        it("Funded Amount Data Updated"), async function () {
            await fundMe.Fund({ value: valueAmount })
            const response = await fundMe.amountFunded(deployer);
            assert.equal(response.toSting(), valueAmount.toString())
        }
        it("Funder added into Funders Array", async function () {
            await fundMe.Fund({ value: valueAmount })
            const funder = await fundMe.funders[0]
            assert.equal(funder, deployer)
        })
    })

    describe('withdraw', function () {
        beforeEach(async function () {
            await fundMe.Fund({ value: valueAmount })
        })

        it("Only Owner is allowed to withdraw", async () => {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.Withdraw()).to.be.revertedWith("FundMe__NotOwner");
        })
    })
})