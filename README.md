# n8n-nodes-bitstamp

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Bitstamp**, one of the world's oldest and most trusted cryptocurrency exchanges. Founded in 2011 in Luxembourg, Bitstamp supports trading of 80+ cryptocurrencies with spot trading, staking, and lending services. This node enables workflow automation for trading, account management, market data access, and crypto operations.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **Account Management**: View balances, transaction history, trading fees, and account information
- **Market Data**: Access real-time tickers, order books, OHLC data, and trading pairs (public API)
- **Trading**: Place limit, market, and instant orders; manage and cancel orders
- **Withdrawals**: Withdraw BTC, ETH, LTC, XRP, and 15+ other cryptocurrencies
- **Deposits**: Get deposit addresses for all supported cryptocurrencies
- **Staking**: Stake/unstake crypto, view staking balances and transaction history

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-bitstamp`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Install the package
npm install n8n-nodes-bitstamp
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-bitstamp.git
cd n8n-nodes-bitstamp

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bitstamp

# Restart n8n
n8n start
```

## Credentials Setup

To use this node, you need to create API credentials on Bitstamp:

1. Log in to your Bitstamp account
2. Go to **Account** → **Security** → **API Access**
3. Click **Create New API Key**
4. Configure permissions (enable the operations you need)
5. Save your API Key, API Secret, and note your Customer ID

| Field | Description |
|-------|-------------|
| API Key | Your Bitstamp API key |
| API Secret | Your Bitstamp API secret (keep secure) |
| Client ID | Your Bitstamp customer/user ID |

## Resources & Operations

### Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Get balance for all currencies |
| Get Balance by Currency | Get balance for a specific currency |
| Get User Transactions | Get transaction history with pagination |
| Get All Fees | Get all trading fees |
| Get Fee by Market | Get fee for a specific trading pair |
| Get Account Info | Get account information |

### Market Data (Public - No Authentication Required)

| Operation | Description |
|-----------|-------------|
| Get Ticker | Current ticker for trading pair |
| Get Hourly Ticker | Hourly ticker data |
| Get Order Book | Full order book with optional grouping |
| Get Transactions | Recent public trades |
| Get OHLC | Candlestick/OHLC data with customizable timeframes |
| Get Trading Pairs | List all available trading pairs |
| Get EUR/USD Rate | EUR/USD conversion rate |

### Trading

| Operation | Description |
|-----------|-------------|
| Place Buy Limit Order | Place a limit buy order |
| Place Sell Limit Order | Place a limit sell order |
| Place Buy Market Order | Place a market buy order |
| Place Sell Market Order | Place a market sell order |
| Place Buy Instant Order | Place an instant buy order |
| Place Sell Instant Order | Place an instant sell order |
| Cancel Order | Cancel an order by ID |
| Cancel All Orders | Cancel all open orders |
| Get Open Orders | List all open orders |
| Get Order Status | Get order status and details |

### Withdrawal

| Operation | Description |
|-----------|-------------|
| Get Withdrawal Requests | List withdrawal history |
| Withdraw Bitcoin | Withdraw BTC |
| Withdraw Litecoin | Withdraw LTC |
| Withdraw Ethereum | Withdraw ETH |
| Withdraw Ripple | Withdraw XRP (with destination tag support) |
| Withdraw Crypto | Withdraw any supported cryptocurrency |
| Cancel Withdrawal | Cancel a pending withdrawal |

### Deposit

| Operation | Description |
|-----------|-------------|
| Get Bitcoin Deposit Address | Get BTC deposit address |
| Get Litecoin Deposit Address | Get LTC deposit address |
| Get Ethereum Deposit Address | Get ETH deposit address |
| Get Crypto Deposit Address | Get deposit address for any crypto |
| Get Unconfirmed Deposits | List pending deposits |

### Staking

| Operation | Description |
|-----------|-------------|
| Get Staking Info | Get staking rates and information |
| Stake | Stake cryptocurrency |
| Unstake | Unstake cryptocurrency |
| Get Staking Transactions | List staking history |
| Get Staking Balance | Get staked balance |

## Usage Examples

### Get BTC/USD Ticker

```javascript
// Configure the node:
// Resource: Market Data
// Operation: Get Ticker
// Currency Pair: BTC/USD

// Output:
{
  "high": "43500.00",
  "last": "43250.00",
  "timestamp": "1704067200",
  "bid": "43240.00",
  "vwap": "43150.00",
  "volume": "1234.56789012",
  "low": "42800.00",
  "ask": "43260.00",
  "open": "43000.00"
}
```

### Place a Limit Buy Order

```javascript
// Configure the node:
// Resource: Trading
// Operation: Place Buy Limit Order
// Currency Pair: BTC/USD
// Amount: "0.001"
// Price: "42000.00"

// Output:
{
  "id": "12345678",
  "datetime": "2024-01-01 12:00:00",
  "type": "0",
  "price": "42000.00",
  "amount": "0.001"
}
```

### Get Account Balance

```javascript
// Configure the node:
// Resource: Account
// Operation: Get Balance

// Output:
{
  "btc_balance": "1.23456789",
  "btc_available": "1.20000000",
  "btc_reserved": "0.03456789",
  "usd_balance": "10000.00",
  "usd_available": "9500.00",
  "usd_reserved": "500.00",
  // ... more currencies
}
```

## Supported Trading Pairs

Bitstamp supports 80+ trading pairs including:

- **Major pairs**: BTC/USD, BTC/EUR, ETH/USD, ETH/EUR, ETH/BTC
- **Stablecoins**: USDC/USD, USDT/USD, DAI/USD
- **Altcoins**: SOL/USD, LINK/USD, MATIC/USD, UNI/USD, AAVE/USD

## OHLC Timeframes

Available timeframes for candlestick data:

| Timeframe | Value (seconds) |
|-----------|-----------------|
| 1 Minute | 60 |
| 3 Minutes | 180 |
| 5 Minutes | 300 |
| 15 Minutes | 900 |
| 30 Minutes | 1800 |
| 1 Hour | 3600 |
| 2 Hours | 7200 |
| 4 Hours | 14400 |
| 6 Hours | 21600 |
| 12 Hours | 43200 |
| 1 Day | 86400 |
| 3 Days | 259200 |

## Error Handling

The node handles Bitstamp-specific errors gracefully:

- **Invalid signature**: Check that your API credentials are correct
- **Missing key**: Ensure API key is provided
- **Invalid nonce**: Nonce must be incrementing (automatically handled)
- **API key not found**: Invalid API key
- **No permission**: Insufficient API permissions for the operation

Note: Bitstamp returns HTTP 200 even for errors - the node checks the response body for error status.

## Security Best Practices

1. **Never share your API secret** - Keep it secure and don't commit it to version control
2. **Use environment variables** - Store credentials in n8n's credential store
3. **Limit API permissions** - Only enable the operations you need
4. **Enable IP whitelisting** - Restrict API access to specific IPs if possible
5. **Monitor API usage** - Regularly check your API activity on Bitstamp
6. **Use separate API keys** - Create different keys for different workflows

## Rate Limits

Bitstamp allows up to 400 requests per second. The node handles rate limiting gracefully, but consider adding delays between operations in high-frequency workflows.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)
- Email: licensing@velobpa.com

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## Support

- **Documentation**: [Bitstamp API Docs](https://www.bitstamp.net/api/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bitstamp/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Bitstamp](https://www.bitstamp.net/) for providing a robust cryptocurrency exchange API
- [n8n](https://n8n.io/) for the excellent workflow automation platform
- The n8n community for inspiration and support
