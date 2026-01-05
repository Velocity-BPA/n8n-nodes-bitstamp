/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const tradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['trading'],
			},
		},
		options: [
			{
				name: 'Cancel All Orders',
				value: 'cancelAllOrders',
				description: 'Cancel all open orders',
				action: 'Cancel all orders',
			},
			{
				name: 'Cancel Order',
				value: 'cancelOrder',
				description: 'Cancel order by ID',
				action: 'Cancel order',
			},
			{
				name: 'Get Open Orders',
				value: 'getOpenOrders',
				description: 'List all open orders',
				action: 'Get open orders',
			},
			{
				name: 'Get Order Status',
				value: 'getOrderStatus',
				description: 'Get order status',
				action: 'Get order status',
			},
			{
				name: 'Place Buy Instant Order',
				value: 'placeBuyInstantOrder',
				description: 'Place an instant buy order',
				action: 'Place buy instant order',
			},
			{
				name: 'Place Buy Limit Order',
				value: 'placeBuyLimitOrder',
				description: 'Place a limit buy order',
				action: 'Place buy limit order',
			},
			{
				name: 'Place Buy Market Order',
				value: 'placeBuyMarketOrder',
				description: 'Place a market buy order',
				action: 'Place buy market order',
			},
			{
				name: 'Place Sell Instant Order',
				value: 'placeSellInstantOrder',
				description: 'Place an instant sell order',
				action: 'Place sell instant order',
			},
			{
				name: 'Place Sell Limit Order',
				value: 'placeSellLimitOrder',
				description: 'Place a limit sell order',
				action: 'Place sell limit order',
			},
			{
				name: 'Place Sell Market Order',
				value: 'placeSellMarketOrder',
				description: 'Place a market sell order',
				action: 'Place sell market order',
			},
		],
		default: 'getOpenOrders',
	},
];

export const tradingFields: INodeProperties[] = [
	// Currency pair for trading operations
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: [
					'placeBuyLimitOrder',
					'placeSellLimitOrder',
					'placeBuyMarketOrder',
					'placeSellMarketOrder',
					'placeBuyInstantOrder',
					'placeSellInstantOrder',
					'getOpenOrders',
					'cancelAllOrders',
				],
			},
		},
		options: [
			{ name: 'All Pairs (for queries)', value: 'all' },
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
			{ name: 'LINK/EUR', value: 'linkeur' },
			{ name: 'LINK/USD', value: 'linkusd' },
			{ name: 'LTC/BTC', value: 'ltcbtc' },
			{ name: 'LTC/EUR', value: 'ltceur' },
			{ name: 'LTC/USD', value: 'ltcusd' },
			{ name: 'MATIC/EUR', value: 'maticeur' },
			{ name: 'MATIC/USD', value: 'maticusd' },
			{ name: 'SOL/EUR', value: 'soleur' },
			{ name: 'SOL/USD', value: 'solusd' },
			{ name: 'UNI/EUR', value: 'unieur' },
			{ name: 'UNI/USD', value: 'uniusd' },
			{ name: 'XRP/EUR', value: 'xrpeur' },
			{ name: 'XRP/USD', value: 'xrpusd' },
		],
		default: 'btcusd',
		description: 'Trading pair',
	},

	// Amount field for order placement
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: [
					'placeBuyLimitOrder',
					'placeSellLimitOrder',
					'placeBuyMarketOrder',
					'placeSellMarketOrder',
					'placeBuyInstantOrder',
					'placeSellInstantOrder',
				],
			},
		},
		default: '',
		description: 'Order amount (use string for precision)',
	},

	// Price field for limit orders
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: ['placeBuyLimitOrder', 'placeSellLimitOrder'],
			},
		},
		default: '',
		description: 'Limit price (use string for precision)',
	},

	// Limit price for instant orders
	{
		displayName: 'Limit Price',
		name: 'limitPrice',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: ['placeBuyInstantOrder', 'placeSellInstantOrder'],
			},
		},
		default: '',
		description: 'Optional limit price for instant orders',
	},

	// Order ID for cancel/status operations
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: ['cancelOrder', 'getOrderStatus'],
			},
		},
		default: '',
		description: 'Order ID',
	},

	// Additional fields for limit orders
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: [
					'placeBuyLimitOrder',
					'placeSellLimitOrder',
					'placeBuyMarketOrder',
					'placeSellMarketOrder',
				],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Client Order ID',
				name: 'client_order_id',
				type: 'string',
				default: '',
				description: 'Client-assigned order ID for tracking',
			},
			{
				displayName: 'Immediate or Cancel',
				name: 'ioc_order',
				type: 'boolean',
				default: false,
				description: 'Whether this is an immediate-or-cancel order',
			},
			{
				displayName: 'Fill or Kill',
				name: 'fok_order',
				type: 'boolean',
				default: false,
				description: 'Whether this is a fill-or-kill order',
			},
			{
				displayName: 'Good Till Date',
				name: 'gtd_datetime',
				type: 'dateTime',
				default: '',
				description: 'Good till date for the order',
			},
		],
	},

	// Additional fields for instant orders
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: ['placeBuyInstantOrder', 'placeSellInstantOrder'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Client Order ID',
				name: 'client_order_id',
				type: 'string',
				default: '',
				description: 'Client-assigned order ID for tracking',
			},
		],
	},

	// Additional fields for getOrderStatus
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['trading'],
				operation: ['getOrderStatus'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Omit Transactions',
				name: 'omit_transactions',
				type: 'boolean',
				default: false,
				description: 'Whether to omit transactions from the response',
			},
		],
	},
];
