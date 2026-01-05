/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const marketDataOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['marketData'],
			},
		},
		options: [
			{
				name: 'Get EUR/USD Rate',
				value: 'getEurUsdRate',
				description: 'Get EUR/USD conversion rate',
				action: 'Get EUR USD rate',
			},
			{
				name: 'Get Hourly Ticker',
				value: 'getHourlyTicker',
				description: 'Get hourly ticker data',
				action: 'Get hourly ticker',
			},
			{
				name: 'Get OHLC',
				value: 'getOHLC',
				description: 'Get candlestick/OHLC data',
				action: 'Get OHLC data',
			},
			{
				name: 'Get Order Book',
				value: 'getOrderBook',
				description: 'Get full order book',
				action: 'Get order book',
			},
			{
				name: 'Get Ticker',
				value: 'getTicker',
				description: 'Get current ticker for trading pair',
				action: 'Get ticker',
			},
			{
				name: 'Get Trading Pairs',
				value: 'getTradingPairs',
				description: 'List all trading pairs',
				action: 'Get trading pairs',
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'Get recent public trades',
				action: 'Get transactions',
			},
		],
		default: 'getTicker',
	},
];

export const marketDataFields: INodeProperties[] = [
	// Currency pair field for most operations
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTicker', 'getHourlyTicker', 'getOrderBook', 'getTransactions', 'getOHLC'],
			},
		},
		options: [
			{ name: 'AAVE/EUR', value: 'aaveeur' },
			{ name: 'AAVE/USD', value: 'aaveusd' },
			{ name: 'ALGO/EUR', value: 'algoeur' },
			{ name: 'ALGO/USD', value: 'algousd' },
			{ name: 'BCH/BTC', value: 'bchbtc' },
			{ name: 'BCH/EUR', value: 'bcheur' },
			{ name: 'BCH/USD', value: 'bchusd' },
			{ name: 'BTC/EUR', value: 'btceur' },
			{ name: 'BTC/GBP', value: 'btcgbp' },
			{ name: 'BTC/USD', value: 'btcusd' },
			{ name: 'BTC/USDC', value: 'btcusdc' },
			{ name: 'BTC/USDT', value: 'btcusdt' },
			{ name: 'COMP/EUR', value: 'compeur' },
			{ name: 'COMP/USD', value: 'compusd' },
			{ name: 'DAI/USD', value: 'daiusd' },
			{ name: 'ETH/BTC', value: 'ethbtc' },
			{ name: 'ETH/EUR', value: 'etheur' },
			{ name: 'ETH/GBP', value: 'ethgbp' },
			{ name: 'ETH/USD', value: 'ethusd' },
			{ name: 'ETH/USDC', value: 'ethusdc' },
			{ name: 'ETH/USDT', value: 'ethusdt' },
			{ name: 'EUR/USD', value: 'eurusd' },
			{ name: 'GBP/EUR', value: 'gbpeur' },
			{ name: 'GBP/USD', value: 'gbpusd' },
			{ name: 'LINK/BTC', value: 'linkbtc' },
			{ name: 'LINK/EUR', value: 'linkeur' },
			{ name: 'LINK/USD', value: 'linkusd' },
			{ name: 'LTC/BTC', value: 'ltcbtc' },
			{ name: 'LTC/EUR', value: 'ltceur' },
			{ name: 'LTC/GBP', value: 'ltcgbp' },
			{ name: 'LTC/USD', value: 'ltcusd' },
			{ name: 'MATIC/EUR', value: 'maticeur' },
			{ name: 'MATIC/USD', value: 'maticusd' },
			{ name: 'MKR/EUR', value: 'mkreur' },
			{ name: 'MKR/USD', value: 'mkrusd' },
			{ name: 'SHIB/EUR', value: 'shibeur' },
			{ name: 'SHIB/USD', value: 'shibusd' },
			{ name: 'SOL/EUR', value: 'soleur' },
			{ name: 'SOL/USD', value: 'solusd' },
			{ name: 'UNI/EUR', value: 'unieur' },
			{ name: 'UNI/USD', value: 'uniusd' },
			{ name: 'USDC/EUR', value: 'usdceur' },
			{ name: 'USDC/USD', value: 'usdcusd' },
			{ name: 'USDC/USDT', value: 'usdcusdt' },
			{ name: 'USDT/EUR', value: 'usdteur' },
			{ name: 'USDT/USD', value: 'usdtusd' },
			{ name: 'XLM/BTC', value: 'xlmbtc' },
			{ name: 'XLM/EUR', value: 'xlmeur' },
			{ name: 'XLM/USD', value: 'xlmusd' },
			{ name: 'XRP/BTC', value: 'xrpbtc' },
			{ name: 'XRP/EUR', value: 'xrpeur' },
			{ name: 'XRP/GBP', value: 'xrpgbp' },
			{ name: 'XRP/USD', value: 'xrpusd' },
		],
		default: 'btcusd',
		description: 'Trading pair',
	},

	// getOrderBook fields
	{
		displayName: 'Group',
		name: 'group',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getOrderBook'],
			},
		},
		options: [
			{ name: 'Order Decimals', value: 0 },
			{ name: 'Group 1', value: 1 },
			{ name: 'Group 2', value: 2 },
		],
		default: 0,
		description: 'Order book grouping level',
	},

	// getTransactions fields
	{
		displayName: 'Time Range',
		name: 'time',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getTransactions'],
			},
		},
		options: [
			{ name: 'Last Minute', value: 'minute' },
			{ name: 'Last Hour', value: 'hour' },
			{ name: 'Last Day', value: 'day' },
		],
		default: 'hour',
		description: 'Time range for transactions',
	},

	// getOHLC fields
	{
		displayName: 'Step',
		name: 'step',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getOHLC'],
			},
		},
		options: [
			{ name: '1 Minute', value: 60 },
			{ name: '3 Minutes', value: 180 },
			{ name: '5 Minutes', value: 300 },
			{ name: '15 Minutes', value: 900 },
			{ name: '30 Minutes', value: 1800 },
			{ name: '1 Hour', value: 3600 },
			{ name: '2 Hours', value: 7200 },
			{ name: '4 Hours', value: 14400 },
			{ name: '6 Hours', value: 21600 },
			{ name: '12 Hours', value: 43200 },
			{ name: '1 Day', value: 86400 },
			{ name: '3 Days', value: 259200 },
		],
		default: 3600,
		description: 'Timeframe for each candlestick',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getOHLC'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['marketData'],
				operation: ['getOHLC'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Start Time',
				name: 'start',
				type: 'dateTime',
				default: '',
				description: 'Unix timestamp for start of period',
			},
			{
				displayName: 'End Time',
				name: 'end',
				type: 'dateTime',
				default: '',
				description: 'Unix timestamp for end of period',
			},
			{
				displayName: 'Exclude Current',
				name: 'exclude_current_candle',
				type: 'boolean',
				default: false,
				description: 'Whether to exclude the current (incomplete) candle',
			},
		],
	},
];
