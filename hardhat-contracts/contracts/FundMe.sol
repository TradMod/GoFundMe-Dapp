// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./PriceConverter.sol";
import "hardhat/console.sol";

///// @title Crowd Funding Smart Contract.
///// @author AB Dee

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint;

    address[] public funders;

    mapping(address => uint) public amountFunded;

    uint public constant MINIMUM_USD = 50 * 10**18;

    address public immutable ContractOwner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        ContractOwner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function Fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Pehli Fursat Main Nikal! Gareeb xD"
        );
        // console.log("AOA");
        funders.push(msg.sender);
        amountFunded[msg.sender] = msg.value;
    }

    // function Balance() public view returns (uint) {
    //     return address(this).balance;
    // }

    function Withdraw() public contractOwnerOnly {
        for (uint i; i < funders.length; i++) {
            address funder = funders[i];
            amountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Transaction Failed");
    }

    modifier contractOwnerOnly() {
        // require(msg.sender == ContractOwner, "Chor! Chor! Chor!");
        if (msg.sender != ContractOwner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    receive() external payable {
        Fund();
    }

    fallback() external payable {
        Fund();
    }
}
