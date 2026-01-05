/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IBitstampCredentials {
	apiKey: string;
	apiSecret: string;
	clientId: string;
}

export interface IBitstampTicker {
	high: string;
	last: string;
	timestamp: string;
	bid: string;
	vwap: string;
	volume: string;
	low: string;
	ask: string;
	open: string;
	open_24: string;
	percent_change_24: string;
}

export interface IBitstampOrderBook {
	timestamp: string;
	microtimestamp: string;
	bids: [string, string][];
	asks: [string, string][];
}

export interface IBitstampTransaction {
	date: string;
	tid: string;
	price: string;
	amount: string;
	type: string;
}

export interface IBitstampOHLC {
	high: string;
	timestamp: string;
	volume: string;
	low: string;
	close: string;
	open: string;
}

export interface IBitstampBalance {
	[key: string]: string;
}

export interface IBitstampOrder {
	id: string;
	datetime: string;
	type: string;
	price: string;
	amount: string;
	currency_pair: string;
	status?: string;
	client_order_id?: string;
}

export interface IBitstampUserTransaction {
	datetime: string;
	id: string;
	type: string;
	usd?: string;
	eur?: string;
	btc?: string;
	eth?: string;
	fee: string;
	order_id?: string;
}

export interface IBitstampTradingPair {
	name: string;
	url_symbol: string;
	base_decimals: number;
	counter_decimals: number;
	instant_order_counter_decimals: number;
	minimum_order: string;
	trading: string;
	instant_and_market_orders: string;
	description: string;
}

export interface IBitstampWithdrawalRequest {
	id: string;
	datetime: string;
	type: number;
	currency: string;
	amount: string;
	status: number;
	address?: string;
	transaction_id?: string;
}

export interface IBitstampDepositAddress {
	address: string;
	destination_tag?: string;
}

export interface IBitstampStakingInfo {
	currency: string;
	apy: string;
	minimum_stake: string;
	locked_period_days: number;
}

export interface IBitstampStakingTransaction {
	id: string;
	datetime: string;
	type: string;
	currency: string;
	amount: string;
	status: string;
}

export interface IBitstampFee {
	currency_pair: string;
	fees: {
		maker: string;
		taker: string;
	};
}

export interface IBitstampErrorResponse {
	status: string;
	reason: {
		__all__?: string[];
		[key: string]: string[] | undefined;
	};
}

export type BitstampResource =
	| 'account'
	| 'marketData'
	| 'trading'
	| 'withdrawal'
	| 'deposit'
	| 'staking';

export type AccountOperation =
	| 'getBalance'
	| 'getBalanceByCurrency'
	| 'getUserTransactions'
	| 'getAllFees'
	| 'getFeeByMarket'
	| 'getAccountInfo';

export type MarketDataOperation =
	| 'getTicker'
	| 'getHourlyTicker'
	| 'getOrderBook'
	| 'getTransactions'
	| 'getOHLC'
	| 'getTradingPairs'
	| 'getEurUsdRate';

export type TradingOperation =
	| 'placeBuyLimitOrder'
	| 'placeSellLimitOrder'
	| 'placeBuyMarketOrder'
	| 'placeSellMarketOrder'
	| 'placeBuyInstantOrder'
	| 'placeSellInstantOrder'
	| 'cancelOrder'
	| 'cancelAllOrders'
	| 'getOpenOrders'
	| 'getOrderStatus';

export type WithdrawalOperation =
	| 'getWithdrawalRequests'
	| 'withdrawBitcoin'
	| 'withdrawLitecoin'
	| 'withdrawEthereum'
	| 'withdrawRipple'
	| 'withdrawCrypto'
	| 'cancelWithdrawal';

export type DepositOperation =
	| 'getBitcoinDepositAddress'
	| 'getLitecoinDepositAddress'
	| 'getEthereumDepositAddress'
	| 'getCryptoDepositAddress'
	| 'getUnconfirmedDeposits';

export type StakingOperation =
	| 'getStakingInfo'
	| 'stake'
	| 'unstake'
	| 'getStakingTransactions'
	| 'getStakingBalance';
