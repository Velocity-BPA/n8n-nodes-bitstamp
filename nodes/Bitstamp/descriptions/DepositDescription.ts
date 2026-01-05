/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const depositOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deposit'],
			},
		},
		options: [
			{
				name: 'Get Bitcoin Deposit Address',
				value: 'getBitcoinDepositAddress',
				description: 'Get BTC deposit address',
				action: 'Get bitcoin deposit address',
			},
			{
				name: 'Get Crypto Deposit Address',
				value: 'getCryptoDepositAddress',
				description: 'Get deposit address for any cryptocurrency',
				action: 'Get crypto deposit address',
			},
			{
				name: 'Get Ethereum Deposit Address',
				value: 'getEthereumDepositAddress',
				description: 'Get ETH deposit address',
				action: 'Get ethereum deposit address',
			},
			{
				name: 'Get Litecoin Deposit Address',
				value: 'getLitecoinDepositAddress',
				description: 'Get LTC deposit address',
				action: 'Get litecoin deposit address',
			},
			{
				name: 'Get Unconfirmed Deposits',
				value: 'getUnconfirmedDeposits',
				description: 'List pending deposits',
				action: 'Get unconfirmed deposits',
			},
		],
		default: 'getBitcoinDepositAddress',
	},
];

export const depositFields: INodeProperties[] = [
	// Currency for generic crypto deposit address
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['deposit'],
				operation: ['getCryptoDepositAddress'],
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
			{ name: 'LINK', value: 'link' },
			{ name: 'LTC', value: 'ltc' },
			{ name: 'MATIC', value: 'matic' },
			{ name: 'MKR', value: 'mkr' },
			{ name: 'SHIB', value: 'shib' },
			{ name: 'SOL', value: 'sol' },
			{ name: 'UNI', value: 'uni' },
			{ name: 'USDC', value: 'usdc' },
			{ name: 'USDT', value: 'usdt' },
			{ name: 'XLM', value: 'xlm' },
			{ name: 'XRP', value: 'xrp' },
		],
		default: 'btc',
		description: 'Currency to get deposit address for',
	},

	// Additional fields for unconfirmed deposits
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['deposit'],
				operation: ['getUnconfirmedDeposits'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				options: [
					{ name: 'All Currencies', value: '' },
					{ name: 'BTC', value: 'btc' },
					{ name: 'ETH', value: 'eth' },
					{ name: 'LTC', value: 'ltc' },
					{ name: 'XRP', value: 'xrp' },
					{ name: 'BCH', value: 'bch' },
					{ name: 'XLM', value: 'xlm' },
					{ name: 'LINK', value: 'link' },
					{ name: 'USDC', value: 'usdc' },
					{ name: 'USDT', value: 'usdt' },
				],
				default: '',
				description: 'Filter by currency',
			},
		],
	},
];
