/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	bitstampApiRequest,
	bitstampApiRequestAllItems,
	formatTradingPair,
	logLicenseNotice,
} from './GenericFunctions';

import { accountOperations, accountFields } from './descriptions/AccountDescription';
import { marketDataOperations, marketDataFields } from './descriptions/MarketDataDescription';
import { tradingOperations, tradingFields } from './descriptions/TradingDescription';
import { withdrawalOperations, withdrawalFields } from './descriptions/WithdrawalDescription';
import { depositOperations, depositFields } from './descriptions/DepositDescription';
import { stakingOperations, stakingFields } from './descriptions/StakingDescription';

export class Bitstamp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bitstamp',
		name: 'bitstamp',
		icon: 'file:bitstamp.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Bitstamp cryptocurrency exchange API',
		defaults: {
			name: 'Bitstamp',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bitstampApi',
				required: true,
				displayOptions: {
					show: {
						resource: ['account', 'trading', 'withdrawal', 'deposit', 'staking'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Account information and balances',
					},
					{
						name: 'Deposit',
						value: 'deposit',
						description: 'Deposit addresses and pending deposits',
					},
					{
						name: 'Market Data',
						value: 'marketData',
						description: 'Public market data (no authentication required)',
					},
					{
						name: 'Staking',
						value: 'staking',
						description: 'Staking operations',
					},
					{
						name: 'Trading',
						value: 'trading',
						description: 'Trading orders and operations',
					},
					{
						name: 'Withdrawal',
						value: 'withdrawal',
						description: 'Withdrawal operations',
					},
				],
				default: 'marketData',
			},
			...accountOperations,
			...accountFields,
			...marketDataOperations,
			...marketDataFields,
			...tradingOperations,
			...tradingFields,
			...withdrawalOperations,
			...withdrawalFields,
			...depositOperations,
			...depositFields,
			...stakingOperations,
			...stakingFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per execution
		logLicenseNotice(this);

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// Account Resource
				if (resource === 'account') {
					if (operation === 'getBalance') {
						responseData = await bitstampApiRequest.call(this, 'POST', 'balance');
					} else if (operation === 'getBalanceByCurrency') {
						const currency = this.getNodeParameter('currency', i) as string;
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`balance/${currency}`,
						);
					} else if (operation === 'getUserTransactions') {
						const currencyPair = this.getNodeParameter('currencyPair', i, '') as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {};
						if (additionalFields.offset) {
							body.offset = additionalFields.offset;
						}
						if (additionalFields.sort) {
							body.sort = additionalFields.sort;
						}
						if (additionalFields.sinceTimestamp) {
							body.since_timestamp = Math.floor(
								new Date(additionalFields.sinceTimestamp as string).getTime() / 1000,
							);
						}

						const endpoint = currencyPair
							? `user_transactions/${currencyPair}`
							: 'user_transactions';

						if (returnAll) {
							responseData = await bitstampApiRequestAllItems.call(
								this,
								'POST',
								endpoint,
								body,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							body.limit = limit;
							responseData = await bitstampApiRequest.call(this, 'POST', endpoint, body);
						}
					} else if (operation === 'getAllFees') {
						responseData = await bitstampApiRequest.call(this, 'POST', 'fees/trading');
					} else if (operation === 'getFeeByMarket') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`fees/trading/${currencyPair}`,
						);
					} else if (operation === 'getAccountInfo') {
						responseData = await bitstampApiRequest.call(this, 'POST', 'account_balances');
					} else {
						throw new Error(`Unknown operation: ${operation}`);
					}
				}

				// Market Data Resource (Public endpoints)
				else if (resource === 'marketData') {
					if (operation === 'getTicker') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						responseData = await bitstampApiRequest.call(
							this,
							'GET',
							`ticker/${currencyPair}`,
							{},
							true,
						);
					} else if (operation === 'getHourlyTicker') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						responseData = await bitstampApiRequest.call(
							this,
							'GET',
							`ticker_hour/${currencyPair}`,
							{},
							true,
						);
					} else if (operation === 'getOrderBook') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						const group = this.getNodeParameter('group', i, 0) as number;
						responseData = await bitstampApiRequest.call(
							this,
							'GET',
							`order_book/${currencyPair}?group=${group}`,
							{},
							true,
						);
					} else if (operation === 'getTransactions') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						const time = this.getNodeParameter('time', i, 'hour') as string;
						responseData = await bitstampApiRequest.call(
							this,
							'GET',
							`transactions/${currencyPair}?time=${time}`,
							{},
							true,
						);
					} else if (operation === 'getOHLC') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						const step = this.getNodeParameter('step', i) as number;
						const limit = this.getNodeParameter('limit', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						let url = `ohlc/${currencyPair}?step=${step}&limit=${limit}`;

						if (additionalFields.start) {
							const startTime = Math.floor(
								new Date(additionalFields.start as string).getTime() / 1000,
							);
							url += `&start=${startTime}`;
						}
						if (additionalFields.end) {
							const endTime = Math.floor(
								new Date(additionalFields.end as string).getTime() / 1000,
							);
							url += `&end=${endTime}`;
						}
						if (additionalFields.exclude_current_candle) {
							url += '&exclude_current_candle=true';
						}

						responseData = await bitstampApiRequest.call(this, 'GET', url, {}, true);
					} else if (operation === 'getTradingPairs') {
						responseData = await bitstampApiRequest.call(
							this,
							'GET',
							'trading-pairs-info',
							{},
							true,
						);
					} else if (operation === 'getEurUsdRate') {
						responseData = await bitstampApiRequest.call(this, 'GET', 'eur_usd', {}, true);
					} else {
						throw new Error(`Unknown operation: ${operation}`);
					}
				}

				// Trading Resource
				else if (resource === 'trading') {
					if (operation === 'placeBuyLimitOrder') {
						const currencyPair = formatTradingPair(
							this.getNodeParameter('currencyPair', i) as string,
						);
						const amount = this.getNodeParameter('amount', i) as string;
						const price = this.getNodeParameter('price', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							amount,
							price,
						};

						if (additionalFields.client_order_id) {
							body.client_order_id = additionalFields.client_order_id;
						}
						if (additionalFields.ioc_order) {
							body.ioc_order = additionalFields.ioc_order;
						}
						if (additionalFields.fok_order) {
							body.fok_order = additionalFields.fok_order;
						}
						if (additionalFields.gtd_datetime) {
							body.gtd_datetime = additionalFields.gtd_datetime;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`buy/${currencyPair}`,
							body,
						);
					} else if (operation === 'placeSellLimitOrder') {
						const currencyPair = formatTradingPair(
							this.getNodeParameter('currencyPair', i) as string,
						);
						const amount = this.getNodeParameter('amount', i) as string;
						const price = this.getNodeParameter('price', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							amount,
							price,
						};

						if (additionalFields.client_order_id) {
							body.client_order_id = additionalFields.client_order_id;
						}
						if (additionalFields.ioc_order) {
							body.ioc_order = additionalFields.ioc_order;
						}
						if (additionalFields.fok_order) {
							body.fok_order = additionalFields.fok_order;
						}
						if (additionalFields.gtd_datetime) {
							body.gtd_datetime = additionalFields.gtd_datetime;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`sell/${currencyPair}`,
							body,
						);
					} else if (operation === 'placeBuyMarketOrder') {
						const currencyPair = formatTradingPair(
							this.getNodeParameter('currencyPair', i) as string,
						);
						const amount = this.getNodeParameter('amount', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { amount };

						if (additionalFields.client_order_id) {
							body.client_order_id = additionalFields.client_order_id;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`buy/market/${currencyPair}`,
							body,
						);
					} else if (operation === 'placeSellMarketOrder') {
						const currencyPair = formatTradingPair(
							this.getNodeParameter('currencyPair', i) as string,
						);
						const amount = this.getNodeParameter('amount', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { amount };

						if (additionalFields.client_order_id) {
							body.client_order_id = additionalFields.client_order_id;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`sell/market/${currencyPair}`,
							body,
						);
					} else if (operation === 'placeBuyInstantOrder') {
						const currencyPair = formatTradingPair(
							this.getNodeParameter('currencyPair', i) as string,
						);
						const amount = this.getNodeParameter('amount', i) as string;
						const limitPrice = this.getNodeParameter('limitPrice', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { amount };

						if (limitPrice) {
							body.limit_price = limitPrice;
						}
						if (additionalFields.client_order_id) {
							body.client_order_id = additionalFields.client_order_id;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`buy/instant/${currencyPair}`,
							body,
						);
					} else if (operation === 'placeSellInstantOrder') {
						const currencyPair = formatTradingPair(
							this.getNodeParameter('currencyPair', i) as string,
						);
						const amount = this.getNodeParameter('amount', i) as string;
						const limitPrice = this.getNodeParameter('limitPrice', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { amount };

						if (limitPrice) {
							body.limit_price = limitPrice;
						}
						if (additionalFields.client_order_id) {
							body.client_order_id = additionalFields.client_order_id;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`sell/instant/${currencyPair}`,
							body,
						);
					} else if (operation === 'cancelOrder') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						responseData = await bitstampApiRequest.call(this, 'POST', 'cancel_order', {
							id: orderId,
						});
					} else if (operation === 'cancelAllOrders') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						const endpoint =
							currencyPair === 'all'
								? 'cancel_all_orders'
								: `cancel_all_orders/${currencyPair}`;
						responseData = await bitstampApiRequest.call(this, 'POST', endpoint);
					} else if (operation === 'getOpenOrders') {
						const currencyPair = this.getNodeParameter('currencyPair', i) as string;
						const endpoint =
							currencyPair === 'all'
								? 'open_orders/all'
								: `open_orders/${currencyPair}`;
						responseData = await bitstampApiRequest.call(this, 'POST', endpoint);
					} else if (operation === 'getOrderStatus') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { id: orderId };
						if (additionalFields.omit_transactions) {
							body.omit_transactions = additionalFields.omit_transactions;
						}

						responseData = await bitstampApiRequest.call(this, 'POST', 'order_status', body);
					} else {
						throw new Error(`Unknown operation: ${operation}`);
					}
				}

				// Withdrawal Resource
				else if (resource === 'withdrawal') {
					if (operation === 'getWithdrawalRequests') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {};
						if (additionalFields.offset) {
							body.offset = additionalFields.offset;
						}
						if (additionalFields.timedelta) {
							body.timedelta = additionalFields.timedelta;
						}

						if (returnAll) {
							responseData = await bitstampApiRequestAllItems.call(
								this,
								'POST',
								'withdrawal-requests',
								body,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							body.limit = limit;
							responseData = await bitstampApiRequest.call(
								this,
								'POST',
								'withdrawal-requests',
								body,
							);
						}
					} else if (operation === 'withdrawBitcoin') {
						const amount = this.getNodeParameter('amount', i) as string;
						const address = this.getNodeParameter('address', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { amount, address };
						if (additionalFields.instant) {
							body.instant = additionalFields.instant ? 1 : 0;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							'bitcoin_withdrawal',
							body,
						);
					} else if (operation === 'withdrawLitecoin') {
						const amount = this.getNodeParameter('amount', i) as string;
						const address = this.getNodeParameter('address', i) as string;

						responseData = await bitstampApiRequest.call(this, 'POST', 'ltc_withdrawal', {
							amount,
							address,
						});
					} else if (operation === 'withdrawEthereum') {
						const amount = this.getNodeParameter('amount', i) as string;
						const address = this.getNodeParameter('address', i) as string;

						responseData = await bitstampApiRequest.call(this, 'POST', 'eth_withdrawal', {
							amount,
							address,
						});
					} else if (operation === 'withdrawRipple') {
						const amount = this.getNodeParameter('amount', i) as string;
						const address = this.getNodeParameter('address', i) as string;
						const destinationTag = this.getNodeParameter('destinationTag', i, '') as string;

						const body: IDataObject = { amount, address };
						if (destinationTag) {
							body.destination_tag = destinationTag;
						}

						responseData = await bitstampApiRequest.call(this, 'POST', 'xrp_withdrawal', body);
					} else if (operation === 'withdrawCrypto') {
						const currency = this.getNodeParameter('currency', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const address = this.getNodeParameter('address', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { amount, address };
						if (additionalFields.destination_tag) {
							body.destination_tag = additionalFields.destination_tag;
						}
						if (additionalFields.network) {
							body.network = additionalFields.network;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`${currency}_withdrawal`,
							body,
						);
					} else if (operation === 'cancelWithdrawal') {
						const withdrawalId = this.getNodeParameter('withdrawalId', i) as string;
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							'withdrawal_cancel',
							{ id: withdrawalId },
						);
					} else {
						throw new Error(`Unknown operation: ${operation}`);
					}
				}

				// Deposit Resource
				else if (resource === 'deposit') {
					if (operation === 'getBitcoinDepositAddress') {
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							'bitcoin_deposit_address',
						);
					} else if (operation === 'getLitecoinDepositAddress') {
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							'ltc_address',
						);
					} else if (operation === 'getEthereumDepositAddress') {
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							'eth_address',
						);
					} else if (operation === 'getCryptoDepositAddress') {
						const currency = this.getNodeParameter('currency', i) as string;
						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							`${currency}_address`,
						);
					} else if (operation === 'getUnconfirmedDeposits') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {};

						if (additionalFields.currency) {
							body.currency = additionalFields.currency;
						}

						responseData = await bitstampApiRequest.call(
							this,
							'POST',
							'unconfirmed_btc',
							body,
						);
					} else {
						throw new Error(`Unknown operation: ${operation}`);
					}
				}

				// Staking Resource
				else if (resource === 'staking') {
					if (operation === 'getStakingInfo') {
						responseData = await bitstampApiRequest.call(this, 'POST', 'earn/subscriptions');
					} else if (operation === 'stake') {
						const currency = this.getNodeParameter('currency', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;

						responseData = await bitstampApiRequest.call(this, 'POST', 'earn/subscribe', {
							currency,
							amount,
						});
					} else if (operation === 'unstake') {
						const currency = this.getNodeParameter('currency', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;

						responseData = await bitstampApiRequest.call(this, 'POST', 'earn/unsubscribe', {
							currency,
							amount,
						});
					} else if (operation === 'getStakingTransactions') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {};
						if (additionalFields.currency) {
							body.currency = additionalFields.currency;
						}
						if (additionalFields.offset) {
							body.offset = additionalFields.offset;
						}
						if (additionalFields.sort) {
							body.sort = additionalFields.sort;
						}

						if (returnAll) {
							responseData = await bitstampApiRequestAllItems.call(
								this,
								'POST',
								'earn/transactions',
								body,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							body.limit = limit;
							responseData = await bitstampApiRequest.call(
								this,
								'POST',
								'earn/transactions',
								body,
							);
						}
					} else if (operation === 'getStakingBalance') {
						const currency = this.getNodeParameter('currency', i) as string;
						responseData = await bitstampApiRequest.call(this, 'POST', 'earn/balances', {
							currency,
						});
					} else {
						throw new Error(`Unknown operation: ${operation}`);
					}
				} else {
					throw new Error(`Unknown resource: ${resource}`);
				}

				// Build return data
				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({
							json: item,
							pairedItem: { item: i },
						});
					}
				} else {
					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
