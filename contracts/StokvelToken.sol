// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title StokvelToken
 * @dev Implementation of the Stokvel Token (STOK)
 * A non-mintable, non-burnable ERC20 token for the Stokvel platform
 */
contract StokvelToken is ERC20 {
    /// @dev Event emitted when a supplier is paid with tokens
    event SupplierPaid(address indexed supplier, uint256 amount);

    /// @dev Total supply of tokens (10 million with 18 decimals)
    uint256 private constant TOTAL_SUPPLY = 10_000_000 * 10**18;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() ERC20("Stokvel", "STOK") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @dev Transfers tokens to a supplier and emits a SupplierPaid event
     * @param supplier The address of the supplier to pay
     * @param amount The amount of tokens to transfer
     * @return bool Returns true if the transfer was successful
     */
    function paySupplier(address supplier, uint256 amount) public returns (bool) {
        require(supplier != address(0), "StokvelToken: pay to the zero address");
        require(amount > 0, "StokvelToken: payment amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "StokvelToken: insufficient balance");

        bool success = transfer(supplier, amount);
        require(success, "StokvelToken: transfer failed");

        emit SupplierPaid(supplier, amount);
        return true;
    }

    /**
     * @dev Returns the total supply of tokens
     * @return uint256 The total supply of tokens
     */
    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }
}