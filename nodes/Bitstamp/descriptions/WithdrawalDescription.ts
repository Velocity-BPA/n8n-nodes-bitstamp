/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const withdrawalOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['withdrawal'],
			},
		},
		options: [
			{
				name: 'Cancel Withdrawal',
				value: 'cancelWithdrawal',
				description: 'Cancel a pending withdrawal',
				action: 'Cancel withdrawal',
			},
			{
				name: 'Get Withdrawal Requests',
				value: 'getWithdrawalRequests',
				description: 'List withdrawal history',
				action: 'Get withdrawal requests',
			},
			{
				name: 'Withdraw Bitcoin',
				value: 'withdrawBitcoin',
				description: 'Withdraw BTC',
				action: 'Withdraw bitcoin',
			},
			{
				name: 'Withdraw Crypto',
				value: 'withdrawCrypto',
				description: 'Withdraw any supported cryptocurrency',
				action: 'Withdraw crypto',
			},
			{
				name: 'Withdraw Ethereum',
				value: 'withdrawEthereum',
				description: 'Withdraw ETH',
				action: 'Withdraw ethereum',
			},
			{
				name: 'Withdraw Litecoin',
				value: 'withdrawLitecoin',
				description: 'Withdraw LTC',
				action: 'Withdraw litecoin',
			},
			{
				name: 'Withdraw Ripple',
				value: 'withdrawRipple',
				description: 'Withdraw XRP',
				action: 'Withdraw ripple',
			},
		],
		default: 'getWithdrawalRequests',
	},
];

export const withdrawalFields: INodeProperties[] = [
	// Amount field for withdrawals
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: [
					'withdrawBitcoin',
					'withdrawLitecoin',
					'withdrawEthereum',
					'withdrawRipple',
					'withdrawCrypto',
				],
			},
		},
		default: '',
		description: 'Withdrawal amount (use string for precision)',
	},

	// Address field for withdrawals
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: [
					'withdrawBitcoin',
					'withdrawLitecoin',
					'withdrawEthereum',
					'withdrawRipple',
					'withdrawCrypto',
				],
			},
		},
		default: '',
		description: 'Destination wallet address',
	},

	// Currency for generic crypto withdrawal
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['withdrawCrypto'],
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
		description: 'Currency to withdraw',
	},

	// Destination tag for XRP/XLM
	{
		displayName: 'Destination Tag',
		name: 'destinationTag',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['withdrawRipple'],
			},
		},
		default: '',
		description: 'Destination tag for XRP (optional)',
	},

	// Withdrawal ID for cancellation
	{
		displayName: 'Withdrawal ID',
		name: 'withdrawalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['cancelWithdrawal'],
			},
		},
		default: '',
		description: 'ID of the withdrawal to cancel',
	},

	// Additional fields for getWithdrawalRequests
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['getWithdrawalRequests'],
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
				resource: ['withdrawal'],
				operation: ['getWithdrawalRequests'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['getWithdrawalRequests'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Skip that many requests before returning results',
			},
			{
				displayName: 'Time Delta',
				name: 'timedelta',
				type: 'number',
				default: 0,
				description: 'Return requests within the last N seconds',
			},
		],
	},

	// Additional fields for crypto withdrawal
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['withdrawCrypto'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Destination Tag',
				name: 'destination_tag',
				type: 'string',
				default: '',
				description: 'Destination tag/memo for currencies that require it (XRP, XLM)',
			},
			{
				displayName: 'Network',
				name: 'network',
				type: 'string',
				default: '',
				description: 'Network to use for withdrawal (e.g., ERC20, BEP20)',
			},
		],
	},

	// Additional fields for BTC withdrawal
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['withdrawal'],
				operation: ['withdrawBitcoin'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Instant',
				name: 'instant',
				type: 'boolean',
				default: false,
				description: 'Whether to use instant withdrawal (if available)',
			},
		],
	},
];
