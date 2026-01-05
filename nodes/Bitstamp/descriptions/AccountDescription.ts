/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get Account Info',
				value: 'getAccountInfo',
				description: 'Get account information',
				action: 'Get account info',
			},
			{
				name: 'Get All Fees',
				value: 'getAllFees',
				description: 'Get all trading fees',
				action: 'Get all fees',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get balance for all currencies',
				action: 'Get balance',
			},
			{
				name: 'Get Balance by Currency',
				value: 'getBalanceByCurrency',
				description: 'Get balance for a specific currency',
				action: 'Get balance by currency',
			},
			{
				name: 'Get Fee by Market',
				value: 'getFeeByMarket',
				description: 'Get fee for a specific trading pair',
				action: 'Get fee by market',
			},
			{
				name: 'Get User Transactions',
				value: 'getUserTransactions',
				description: 'Get transaction history',
				action: 'Get user transactions',
			},
		],
		default: 'getBalance',
	},
];

export const accountFields: INodeProperties[] = [
	// getBalanceByCurrency fields
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getBalanceByCurrency'],
			},
		},
		options: [
			{ name: 'AAVE', value: 'aave' },
			{ name: 'ALGO', value: 'algo' },
			{ name: 'BAT', value: 'bat' },
			{ name: 'BCH', value: 'bch' },
			{ name: 'BTC', value: 'btc' },
			{ name: 'COMP', value: 'comp' },
			{ name: 'DAI', value: 'dai' },
			{ name: 'ETH', value: 'eth' },
			{ name: 'EUR', value: 'eur' },
			{ name: 'GBP', value: 'gbp' },
			{ name: 'LINK', value: 'link' },
			{ name: 'LTC', value: 'ltc' },
			{ name: 'MATIC', value: 'matic' },
			{ name: 'MKR', value: 'mkr' },
			{ name: 'SHIB', value: 'shib' },
			{ name: 'SOL', value: 'sol' },
			{ name: 'UNI', value: 'uni' },
			{ name: 'USD', value: 'usd' },
			{ name: 'USDC', value: 'usdc' },
			{ name: 'USDT', value: 'usdt' },
			{ name: 'XLM', value: 'xlm' },
			{ name: 'XRP', value: 'xrp' },
		],
		default: 'btc',
		description: 'Currency to get balance for',
	},

	// getFeeByMarket fields
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getFeeByMarket'],
			},
		},
		options: [
			{ name: 'BTC/EUR', value: 'btceur' },
			{ name: 'BTC/GBP', value: 'btcgbp' },
			{ name: 'BTC/USD', value: 'btcusd' },
			{ name: 'BTC/USDC', value: 'btcusdc' },
			{ name: 'BTC/USDT', value: 'btcusdt' },
			{ name: 'ETH/BTC', value: 'ethbtc' },
			{ name: 'ETH/EUR', value: 'etheur' },
			{ name: 'ETH/GBP', value: 'ethgbp' },
			{ name: 'ETH/USD', value: 'ethusd' },
			{ name: 'ETH/USDC', value: 'ethusdc' },
			{ name: 'ETH/USDT', value: 'ethusdt' },
			{ name: 'LTC/BTC', value: 'ltcbtc' },
			{ name: 'LTC/EUR', value: 'ltceur' },
			{ name: 'LTC/USD', value: 'ltcusd' },
			{ name: 'SOL/EUR', value: 'soleur' },
			{ name: 'SOL/USD', value: 'solusd' },
			{ name: 'XRP/BTC', value: 'xrpbtc' },
			{ name: 'XRP/EUR', value: 'xrpeur' },
			{ name: 'XRP/USD', value: 'xrpusd' },
		],
		default: 'btcusd',
		description: 'Trading pair to get fee for',
	},

	// getUserTransactions fields
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getUserTransactions'],
			},
		},
		options: [
			{ name: 'All Pairs', value: '' },
			{ name: 'BTC/EUR', value: 'btceur' },
			{ name: 'BTC/GBP', value: 'btcgbp' },
			{ name: 'BTC/USD', value: 'btcusd' },
			{ name: 'ETH/BTC', value: 'ethbtc' },
			{ name: 'ETH/EUR', value: 'etheur' },
			{ name: 'ETH/USD', value: 'ethusd' },
			{ name: 'LTC/BTC', value: 'ltcbtc' },
			{ name: 'LTC/EUR', value: 'ltceur' },
			{ name: 'LTC/USD', value: 'ltcusd' },
			{ name: 'XRP/EUR', value: 'xrpeur' },
			{ name: 'XRP/USD', value: 'xrpusd' },
		],
		default: '',
		description: 'Filter by currency pair (optional)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getUserTransactions'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getUserTransactions'],
				returnAll: [false],
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
				resource: ['account'],
				operation: ['getUserTransactions'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Skip that many transactions before returning results',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sorting order',
			},
			{
				displayName: 'Since Timestamp',
				name: 'sinceTimestamp',
				type: 'dateTime',
				default: '',
				description: 'Return results since this timestamp',
			},
		],
	},
];
