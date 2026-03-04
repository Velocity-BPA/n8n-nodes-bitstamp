# n8n-nodes-bitstamp

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Bitstamp's cryptocurrency trading platform, implementing 5 core resources with full trading, account management, and transaction capabilities for automated crypto trading workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Bitstamp API](https://img.shields.io/badge/Bitstamp-API%20v2-orange)
![Crypto Trading](https://img.shields.io/badge/Crypto-Trading-gold)
![Real-time](https://img.shields.io/badge/Real--time-Data-green)

## Features

- **Trading Pairs Management** - Retrieve market data, ticker information, and trading pair details
- **Order Management** - Place, cancel, modify, and track buy/sell orders with full lifecycle support
- **Account Operations** - Access balance information, trading fees, and account status
- **Withdrawal Processing** - Initiate and monitor cryptocurrency and fiat withdrawals
- **Deposit Tracking** - Monitor incoming deposits and generate deposit addresses
- **Real-time Market Data** - Access live pricing, order books, and trading volumes
- **Multi-Currency Support** - Handle major cryptocurrencies and fiat currency pairs
- **Risk Management** - Built-in validation and error handling for trading operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bitstamp`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-bitstamp
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-bitstamp.git
cd n8n-nodes-bitstamp
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bitstamp
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Bitstamp API key from account settings | Yes |
| API Secret | Your Bitstamp API secret key | Yes |
| Customer ID | Your Bitstamp customer ID (username) | Yes |
| Environment | API environment (Live/Sandbox) | Yes |

## Resources & Operations

### 1. Trading Pairs

| Operation | Description |
|-----------|-------------|
| Get All | Retrieve all available trading pairs |
| Get Ticker | Get current ticker information for specific pair |
| Get Order Book | Fetch current order book data |
| Get Transactions | Retrieve recent transactions for a trading pair |
| Get OHLC Data | Get historical OHLC (candlestick) data |

### 2. Orders

| Operation | Description |
|-----------|-------------|
| Place Buy Order | Create a new buy order (market/limit) |
| Place Sell Order | Create a new sell order (market/limit) |
| Cancel Order | Cancel an existing order by ID |
| Get Order Status | Check the status of a specific order |
| Get Open Orders | Retrieve all currently open orders |
| Get Order History | Get historical order data |
| Cancel All Orders | Cancel all open orders for account |

### 3. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve current account balances |
| Get Trading Fees | Get current trading fee structure |
| Get Account Info | Fetch general account information |
| Get User Transactions | Retrieve account transaction history |
| Get API Permissions | Check current API key permissions |

### 4. Withdrawals

| Operation | Description |
|-----------|-------------|
| Create Withdrawal | Initiate a cryptocurrency or fiat withdrawal |
| Get Withdrawal Status | Check status of specific withdrawal |
| Get Withdrawal History | Retrieve withdrawal transaction history |
| Cancel Withdrawal | Cancel a pending withdrawal request |
| Get Withdrawal Fees | Get current withdrawal fee schedule |

### 5. Deposits

| Operation | Description |
|-----------|-------------|
| Get Deposit Address | Generate or retrieve deposit address for cryptocurrency |
| Get Deposit History | Retrieve deposit transaction history |
| Get Deposit Status | Check status of specific deposit |
| Create Deposit Request | Initiate a fiat deposit request |

## Usage Examples

```javascript
// Get Bitcoin/USD ticker information
{
  "resource": "tradingPairs",
  "operation": "getTicker",
  "pair": "btcusd"
}
```

```javascript
// Place a limit buy order for Ethereum
{
  "resource": "orders",
  "operation": "placeBuyOrder",
  "pair": "ethusd",
  "amount": "0.5",
  "price": "2000.00",
  "type": "limit"
}
```

```javascript
// Check account balances
{
  "resource": "account",
  "operation": "getBalance"
}
```

```javascript
// Initiate Bitcoin withdrawal
{
  "resource": "withdrawals",
  "operation": "createWithdrawal",
  "currency": "btc",
  "amount": "0.001",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Credentials | API key, secret, or customer ID is incorrect | Verify credentials in Bitstamp account settings |
| Insufficient Balance | Not enough funds for the requested operation | Check account balance before placing orders |
| Invalid Trading Pair | Specified trading pair doesn't exist or isn't active | Use valid trading pair symbols (e.g., 'btcusd') |
| Rate Limit Exceeded | Too many API requests in short time period | Implement delays between requests or reduce frequency |
| Order Not Found | Attempting to access non-existent order | Verify order ID exists and belongs to your account |
| Minimum Order Size | Order amount below minimum threshold | Check minimum order requirements for trading pair |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bitstamp/issues)
- **Bitstamp API Documentation**: [https://www.bitstamp.net/api/](https://www.bitstamp.net/api/)
- **Bitstamp Support**: [https://www.bitstamp.net/help/](https://www.bitstamp.net/help/)