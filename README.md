# Stokvel Token (STOK)

A production-ready ERC-20 token implementation for the Stokvel platform on Binance Smart Chain.

## Features

- Name: Stokvel
- Symbol: STOK
- Decimals: 18
- Total Supply: 10,000,000 STOK
- Non-mintable and non-burnable
- Supplier payment functionality with event emission
- Comprehensive test coverage
- BSC Testnet and Mainnet ready

## Technical Stack

- Solidity ^0.8.21
- OpenZeppelin Contracts v5.x
- Hardhat
- TypeScript
- Ethers.js v6

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Malopex7/stokvel-token.git
cd stokvel-token
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PRIVATE_KEY=your_private_key
BSC_TESTNET_URL=your_bsc_testnet_url
BSC_MAINNET_URL=your_bsc_mainnet_url
BSCSCAN_API_KEY=your_bscscan_api_key
```

## Testing

Run the test suite:
```bash
npm test
```

For coverage report:
```bash
npx hardhat coverage
```

## Deployment

### BSC Testnet
```bash
npm run deploy:testnet
```

### BSC Mainnet
```bash
npm run deploy:mainnet
```

## Contract Interaction

### Using MetaMask
1. Connect your MetaMask wallet to BSC network
2. Import the token using the deployed contract address
3. Use the standard ERC-20 functions for transfers and approvals

### For Suppliers
The contract includes a special `paySupplier` function that:
- Transfers tokens to suppliers
- Emits a `SupplierPaid` event for tracking

### Event Listening
Listen for the following events:
- `Transfer(address indexed from, address indexed to, uint256 value)`
- `Approval(address indexed owner, address indexed spender, uint256 value)`
- `SupplierPaid(address indexed supplier, uint256 amount)`

## Security

- Non-mintable and non-burnable implementation
- Standard OpenZeppelin ERC-20 base
- Comprehensive require statements
- Full test coverage
- No external dependencies beyond OpenZeppelin

## License

MIT