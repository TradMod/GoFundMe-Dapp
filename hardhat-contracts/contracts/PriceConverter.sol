// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint)
    {
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint(price * 1e10);
        //ETH in USD
    }

    function getConversionRate(uint ethAmount, AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint)
    {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
