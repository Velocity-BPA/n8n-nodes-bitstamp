# n8n-nodes-bitstamp

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Bitstamp, Europe's oldest cryptocurrency exchange. With 6 core resources, it enables cryptocurrency trading automation, portfolio management, transaction processing, and account monitoring through Bitstamp's robust API platform.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Cryptocurrency](https://img.shields.io/badge/crypto-trading-orange)
![Exchange](https://img.shields.io/badge/exchange-Bitstamp-green)
![API](https://img.shields.io/badge/API-REST-lightblue)

## Features

- **Automated Trading** - Execute buy/sell orders, manage positions, and implement trading strategies
- **Portfolio Management** - Monitor account balances, track performance, and manage multiple currency pairs
- **Transaction Processing** - Handle deposits, withdrawals, and internal transfers programmatically
- **Real-time Market Data** - Access trading pairs, price feeds, and market information
- **Order Management** - Create, modify, cancel, and track order status across all supported pairs
- **Account Monitoring** - Retrieve account information, transaction history, and balance updates
- **Multi-Currency Support** - Work with Bitcoin, Ethereum, and 50+ other cryptocurrencies
- **Risk Management** - Implement stop-loss, take-profit, and other risk management strategies

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
| API Secret | Your Bitstamp API secret for request signing | Yes |
| Customer ID | Your Bitstamp customer ID for authentication | Yes |
| Sandbox Mode | Enable for testing with Bitstamp sandbox environment | No |

## Resources & Operations

### 1. Trading Pair

| Operation | Description |
|-----------|-------------|
| Get All | Retrieve all available trading pairs and their details |
| Get Details | Get specific information about a trading pair |
| Get Ticker | Fetch current price and volume data for a pair |
| Get Order Book | Retrieve current buy/sell orders for a trading pair |
| Get Trades | Get recent trade history for a specific pair |

### 2. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balances for all currencies |
| Get Info | Get general account information and status |
| Get Fees | Retrieve current trading fees for the account |
| Get Activity | Get account activity and transaction history |
| Get Permissions | Check API key permissions and restrictions |

### 3. Order

| Operation | Description |
|-----------|-------------|
| Create | Place a new buy or sell order |
| Cancel | Cancel an existing open order |
| Get | Retrieve details of a specific order |
| Get All | List all orders (open, completed, cancelled) |
| Get Open | Get all currently open orders |
| Get History | Retrieve order execution history |

### 4. Withdrawal

| Operation | Description |
|-----------|-------------|
| Create | Initiate a cryptocurrency or fiat withdrawal |
| Cancel | Cancel a pending withdrawal request |
| Get | Retrieve details of a specific withdrawal |
| Get All | List all withdrawal transactions |
| Get Status | Check the status of a withdrawal request |

### 5. Deposit

| Operation | Description |
|-----------|-------------|
| Get Address | Get deposit address for a specific cryptocurrency |
| Get | Retrieve details of a specific deposit |
| Get All | List all deposit transactions |
| Get History | Get deposit transaction history |

### 6. Transfer

| Operation | Description |
|-----------|-------------|
| Create | Transfer funds between different currency balances |
| Get | Retrieve details of a specific transfer |
| Get All | List all internal transfer transactions |
| Get History | Get complete transfer history |

## Usage Examples

```javascript
// Place a Bitcoin buy order
{
  "pair": "btcusd",
  "amount": "0.001",
  "price": "45000",
  "orderType": "limit"
}
```

```javascript
// Check account balances
{
  "currencies": ["btc", "eth", "usd", "eur"]
}
```

```javascript
// Withdraw Bitcoin to external wallet
{
  "currency": "btc",
  "amount": "0.05",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "destinationTag": ""
}
```

```javascript
// Get order book for Ethereum trading pair
{
  "pair": "ethusd",
  "depth": 50
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Credentials | Authentication failed with provided credentials | Verify API key, secret, and customer ID are correct |
| Insufficient Balance | Account lacks funds for the requested operation | Check account balance and ensure sufficient funds |
| Invalid Trading Pair | Requested trading pair is not supported | Use Get All Trading Pairs to see available options |
| Order Not Found | Specified order ID does not exist | Verify order ID and check if order was already executed |
| Rate Limit Exceeded | API request limit has been reached | Implement delays between requests and retry logic |
| Market Closed | Trading is temporarily suspended for the pair | Check market status and retry when trading resumes |

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
- **Bitstamp API Documentation**: [Bitstamp API Docs](https://www.bitstamp.net/api/)