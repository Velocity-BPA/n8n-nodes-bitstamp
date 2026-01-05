/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const stakingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['staking'],
			},
		},
		options: [
			{
				name: 'Get Staking Balance',
				value: 'getStakingBalance',
				description: 'Get staked balance',
				action: 'Get staking balance',
			},
			{
				name: 'Get Staking Info',
				value: 'getStakingInfo',
				description: 'Get staking rates and information',
				action: 'Get staking info',
			},
			{
				name: 'Get Staking Transactions',
				value: 'getStakingTransactions',
				description: 'List staking history',
				action: 'Get staking transactions',
			},
			{
				name: 'Stake',
				value: 'stake',
				description: 'Stake cryptocurrency',
				action: 'Stake crypto',
			},
			{
				name: 'Unstake',
				value: 'unstake',
				description: 'Unstake cryptocurrency',
				action: 'Unstake crypto',
			},
		],
		default: 'getStakingInfo',
	},
];

export const stakingFields: INodeProperties[] = [
	// Currency for staking operations
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['staking'],
				operation: ['stake', 'unstake', 'getStakingBalance'],
			},
		},
		options: [
			{ name: 'ALGO', value: 'algo' },
			{ name: 'ETH', value: 'eth' },
			{ name: 'SOL', value: 'sol' },
		],
		default: 'eth',
		description: 'Currency to stake/unstake',
	},

	// Amount for stake/unstake
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['staking'],
				operation: ['stake', 'unstake'],
			},
		},
		default: '',
		description: 'Amount to stake/unstake (use string for precision)',
	},

	// Additional fields for staking transactions
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['staking'],
				operation: ['getStakingTransactions'],
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
				resource: ['staking'],
				operation: ['getStakingTransactions'],
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
				resource: ['staking'],
				operation: ['getStakingTransactions'],
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
					{ name: 'ALGO', value: 'algo' },
					{ name: 'ETH', value: 'eth' },
					{ name: 'SOL', value: 'sol' },
				],
				default: '',
				description: 'Filter by currency',
			},
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
		],
	},
];
