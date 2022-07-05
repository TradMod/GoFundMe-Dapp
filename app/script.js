import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log("AOA");


async function connect() {

    if (typeof window.ethereum !== 'undifined') {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Get A Metamask Wallet"
    }

}

async function fund() {
    let ethAmount = document.getElementById('ethAmount').value
    console.log(`Funding...`);
    if (typeof window.ethereum !== 'undifined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.Fund({ value: ethers.utils.parseEther(ethAmount) })
            await listenToTrxMined(transactionResponse, provider);
            console.log("AOA");
        } catch (error) {
            console.log(error);
        }
    }
}

async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.Withdraw()
            await listenToTrxMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== 'undifined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        document.getElementById('p').innerHTML = `${(ethers.utils.formatEther(balance))} ETH`
    }
}

function listenToTrxMined(transactionResponse, provider) {

    console.log(`Mining ${transactionResponse.hash}`);

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
            resolve();
        })
    })

}

