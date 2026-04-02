/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-bitstamp/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import { createHash, createHmac } from 'crypto';
import * as crypto from 'crypto';

export class Bitstamp implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bitstamp',
    name: 'bitstamp',
    icon: 'file:bitstamp.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Bitstamp API',
    defaults: {
      name: 'Bitstamp',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bitstampApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'TradingPairs',
            value: 'tradingPairs',
          },
          {
            name: 'Orders',
            value: 'orders',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Withdrawals',
            value: 'withdrawals',
          },
          {
            name: 'Deposits',
            value: 'deposits',
          },
          {
            name: 'Transfer',
            value: 'transfer',
          }
        ],
        default: 'tradingPairs',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
    },
  },
  options: [
    {
      name: 'Get All Trading Pairs',
      value: 'getAllTradingPairs',
      description: 'Get all available trading pairs and their details',
      action: 'Get all trading pairs',
    },
    {
      name: 'Get Ticker',
      value: 'getTicker',
      description: 'Get ticker information for specific pair',
      action: 'Get ticker information',
    },
    {
      name: 'Get All Tickers',
      value: 'getAllTickers',
      description: 'Get ticker data for all pairs',
      action: 'Get all tickers',
    },
    {
      name: 'Get Hourly Ticker',
      value: 'getHourlyTicker',
      description: 'Get hourly ticker data for specific pair',
      action: 'Get hourly ticker data',
    },
    {
      name: 'Get Order Book',
      value: 'getOrderBook',
      description: 'Get order book for trading pair',
      action: 'Get order book',
    },
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get recent transactions for trading pair',
      action: 'Get recent transactions',
    },
  ],
  default: 'getAllTradingPairs',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['orders'],
    },
  },
  options: [
    {
      name: 'Create Buy Order',
      value: 'createBuyOrder',
      description: 'Place a buy order',
      action: 'Create buy order',
    },
    {
      name: 'Create Sell Order',
      value: 'createSellOrder',
      description: 'Place a sell order',
      action: 'Create sell order',
    },
    {
      name: 'Create Market Buy Order',
      value: 'createMarketBuyOrder',
      description: 'Place a market buy order',
      action: 'Create market buy order',
    },
    {
      name: 'Create Market Sell Order',
      value: 'createMarketSellOrder',
      description: 'Place a market sell order',
      action: 'Create market sell order',
    },
    {
      name: 'Cancel Order',
      value: 'cancelOrder',
      description: 'Cancel an order',
      action: 'Cancel order',
    },
    {
      name: 'Cancel All Orders',
      value: 'cancelAllOrders',
      description: 'Cancel all open orders',
      action: 'Cancel all orders',
    },
    {
      name: 'Get Open Orders',
      value: 'getOpenOrders',
      description: 'Get open orders',
      action: 'Get open orders',
    },
    {
      name: 'Get All Open Orders',
      value: 'getAllOpenOrders',
      description: 'Get all open orders',
      action: 'Get all open orders',
    },
    {
      name: 'Get Pair Open Orders',
      value: 'getPairOpenOrders',
      description: 'Get open orders for specific pair',
      action: 'Get pair open orders',
    },
    {
      name: 'Get Order Status',
      value: 'getOrderStatus',
      description: 'Get order status',
      action: 'Get order status',
    },
  ],
  default: 'createBuyOrder',
},
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
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get account balance',
      action: 'Get balance',
    },
    {
      name: 'Get Pair Balance',
      value: 'getPairBalance',
      description: 'Get balance for specific pair',
      action: 'Get pair balance',
    },
    {
      name: 'Get User Transactions',
      value: 'getUserTransactions',
      description: 'Get user transaction history',
      action: 'Get user transactions',
    },
    {
      name: 'Get Pair Transactions',
      value: 'getPairTransactions',
      description: 'Get transactions for specific pair',
      action: 'Get pair transactions',
    },
    {
      name: 'Get Trading Fees',
      value: 'getTradingFees',
      description: 'Get trading fees for pair',
      action: 'Get trading fees',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
    },
  },
  options: [
    {
      name: 'Get Withdrawal Requests',
      value: 'getWithdrawalRequests',
      description: 'Get withdrawal requests',
      action: 'Get withdrawal requests',
    },
    {
      name: 'Get Open Withdrawals',
      value: 'getOpenWithdrawals',
      description: 'Get open withdrawal requests',
      action: 'Get open withdrawals',
    },
    {
      name: 'Get Withdrawal Status',
      value: 'getWithdrawalStatus',
      description: 'Get withdrawal status',
      action: 'Get withdrawal status',
    },
    {
      name: 'Cancel Withdrawal',
      value: 'cancelWithdrawal',
      description: 'Cancel withdrawal request',
      action: 'Cancel withdrawal',
    },
    {
      name: 'Withdraw Bitcoin',
      value: 'withdrawBitcoin',
      description: 'Withdraw Bitcoin',
      action: 'Withdraw Bitcoin',
    },
    {
      name: 'Withdraw Litecoin',
      value: 'withdrawLitecoin',
      description: 'Withdraw Litecoin',
      action: 'Withdraw Litecoin',
    },
    {
      name: 'Withdraw Ethereum',
      value: 'withdrawEthereum',
      description: 'Withdraw Ethereum',
      action: 'Withdraw Ethereum',
    },
    {
      name: 'Withdraw Ripple',
      value: 'withdrawRipple',
      description: 'Withdraw XRP',
      action: 'Withdraw Ripple',
    },
    {
      name: 'Withdraw Paxos',
      value: 'withdrawPaxos',
      description: 'Withdraw PAX',
      action: 'Withdraw Paxos',
    },
    {
      name: 'Withdraw Fiat',
      value: 'withdrawFiat',
      description: 'Bank withdrawal',
      action: 'Withdraw fiat',
    },
  ],
  default: 'getWithdrawalRequests',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['deposits'],
    },
  },
  options: [
    {
      name: 'Get Bitcoin Address',
      value: 'getBitcoinAddress',
      description: 'Get Bitcoin deposit address',
      action: 'Get Bitcoin deposit address',
    },
    {
      name: 'Get Litecoin Address',
      value: 'getLitecoinAddress',
      description: 'Get Litecoin deposit address',
      action: 'Get Litecoin deposit address',
    },
    {
      name: 'Get Ethereum Address',
      value: 'getEthereumAddress',
      description: 'Get Ethereum deposit address',
      action: 'Get Ethereum deposit address',
    },
    {
      name: 'Get Ripple Address',
      value: 'getRippleAddress',
      description: 'Get XRP deposit address',
      action: 'Get XRP deposit address',
    },
    {
      name: 'Get Paxos Address',
      value: 'getPaxosAddress',
      description: 'Get PAX deposit address',
      action: 'Get Paxos address',
    },
    {
      name: 'Get Unconfirmed Bitcoin',
      value: 'getUnconfirmedBitcoin',
      description: 'Get unconfirmed Bitcoin transactions',
      action: 'Get unconfirmed Bitcoin',
    },
    {
      name: 'Transfer to Main',
      value: 'transferToMain',
      description: 'Transfer from sub account to main',
      action: 'Transfer from sub account to main',
    },
    {
      name: 'Transfer from Main',
      value: 'transferFromMain',
      description: 'Transfer from main to sub account',
      action: 'Transfer from main to sub account',
    },
  ],
  default: 'getBitcoinAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transfer'],
    },
  },
  options: [
    {
      name: 'Transfer to Main',
      value: 'transferToMain',
      description: 'Transfer funds to main account',
      action: 'Transfer to main account',
    },
    {
      name: 'Transfer from Main',
      value: 'transferFromMain',
      description: 'Transfer funds from main account',
      action: 'Transfer from main account',
    },
    {
      name: 'Get Sub-Accounts',
      value: 'getSubAccounts',
      description: 'Get sub-account information',
      action: 'Get sub-accounts',
    },
  ],
  default: 'transferToMain',
},
      // Parameter definitions
{
  displayName: 'Trading Pair',
  name: 'pair',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
      operation: ['getTicker'],
    },
  },
  default: 'btcusd',
  description: 'The trading pair symbol (e.g., btcusd, ethusd)',
},
{
  displayName: 'Trading Pair',
  name: 'pair',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
      operation: ['getHourlyTicker'],
    },
  },
  default: 'btcusd',
  description: 'The trading pair symbol (e.g., btcusd, ethusd)',
},
{
  displayName: 'Trading Pair',
  name: 'pair',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
      operation: ['getOrderBook'],
    },
  },
  default: 'btcusd',
  description: 'The trading pair symbol (e.g., btcusd, ethusd)',
},
{
  displayName: 'Group',
  name: 'group',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
      operation: ['getOrderBook'],
    },
  },
  options: [
    {
      name: '0',
      value: '0',
      description: 'No grouping',
    },
    {
      name: '1',
      value: '1',
      description: 'Group orders by price',
    },
    {
      name: '2',
      value: '2',
      description: 'Group orders by price (higher precision)',
    },
  ],
  default: '1',
  description: 'Group orders in the order book',
},
{
  displayName: 'Trading Pair',
  name: 'pair',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
      operation: ['getTransactions'],
    },
  },
  default: 'btcusd',
  description: 'The trading pair symbol (e.g., btcusd, ethusd)',
},
{
  displayName: 'Time Frame',
  name: 'time',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['tradingPairs'],
      operation: ['getTransactions'],
    },
  },
  options: [
    {
      name: 'Hour',
      value: 'hour',
      description: 'Transactions from the last hour',
    },
    {
      name: 'Minute',
      value: 'minute',
      description: 'Transactions from the last minute',
    },
  ],
  default: 'hour',
  description: 'Time frame for transaction data',
},
{
  displayName: 'Trading Pair',
  name: 'pair',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createBuyOrder', 'createSellOrder', 'createMarketBuyOrder', 'createMarketSellOrder', 'getOpenOrders', 'getPairOpenOrders'],
    },
  },
  default: 'btcusd',
  description: 'The trading pair (e.g., btcusd, ethusd)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createBuyOrder', 'createSellOrder', 'createMarketBuyOrder', 'createMarketSellOrder'],
    },
  },
  default: '',
  description: 'Amount to buy or sell',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createBuyOrder', 'createSellOrder'],
    },
  },
  default: '',
  description: 'Price per unit',
},
{
  displayName: 'Order Type',
  name: 'type',
  type: 'options',
  options: [
    {
      name: 'Limit',
      value: 'limit',
    },
    {
      name: 'Stop Loss',
      value: 'stop_loss',
    },
    {
      name: 'Take Profit',
      value: 'take_profit',
    },
  ],
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createBuyOrder', 'createSellOrder'],
    },
  },
  default: 'limit',
  description: 'Type of order',
},
{
  displayName: 'Time in Force',
  name: 'timeInForce',
  type: 'options',
  options: [
    {
      name: 'Good Till Cancelled',
      value: 'GTC',
    },
    {
      name: 'Immediate or Cancel',
      value: 'IOC',
    },
    {
      name: 'Fill or Kill',
      value: 'FOK',
    },
  ],
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createBuyOrder', 'createSellOrder'],
    },
  },
  default: 'GTC',
  description: 'Time in force for the order',
},
{
  displayName: 'Limit Price',
  name: 'limitPrice',
  type: 'number',
  required: false,
  displayOptions: { 
    show: { 
      resource: ['orders'], 
      operation: ['createBuyOrder', 'createSellOrder'] 
    } 
  },
  default: 0,
  description: 'Limit price for the order',
},
{
  displayName: 'Daily Order',
  name: 'dailyOrder',
  type: 'boolean',
  required: false,
  displayOptions: { 
    show: { 
      resource: ['orders'], 
      operation: ['createBuyOrder', 'createSellOrder'] 
    } 
  },
  default: false,
  description: 'Whether this is a daily order',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['cancelOrder', 'getOrderStatus'],
    },
  },
  default: '',
  description: 'ID of the order',
},
{
  displayName: 'Pair',
  name: 'pair',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getPairBalance', 'getPairTransactions', 'getTradingFees'],
    },
  },
  default: 'btcusd',
  description: 'Trading pair (e.g., btcusd, ethusd)',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getUserTransactions', 'getPairTransactions'],
    },
  },
  default: 0,
  description: 'Skip this many transactions before returning results',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getUserTransactions', 'getPairTransactions'],
    },
  },
  default: 100,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getUserTransactions', 'getPairTransactions'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort transactions by datetime',
},
{
  displayName: 'Since',
  name: 'since',
  type: 'string',
  required: false,
  displayOptions: { 
    show: { 
      resource: ['account'], 
      operation: ['getUserTransactions', 'getPairTransactions'] 
    } 
  },
  default: '',
  description: 'Return transactions with ID greater than specified',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  options: [
    { name: 'Deposit', value: '0' },
    { name: 'Withdrawal', value: '1' },
    { name: 'Trade', value: '2' },
  ],
  required: false,
  displayOptions: { 
    show: { 
      resource: ['account'], 
      operation: ['getUserTransactions'] 
    } 
  },
  default: '',
  description: 'Filter transactions by type',
},
{
  displayName: 'Time Delta',
  name: 'timedelta',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['getWithdrawalRequests'],
    },
  },
  default: 86400,
  description: 'Time delta in seconds',
},
{
  displayName: 'Withdrawal ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['getWithdrawalStatus', 'cancelWithdrawal'],
    },
  },
  default: '',
  description: 'The withdrawal ID',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawBitcoin', 'withdrawLitecoin', 'withdrawEthereum', 'withdrawRipple', 'withdrawPaxos', 'withdrawFiat'],
    },
  },
  default: '',
  description: 'Amount to withdraw',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawBitcoin', 'withdrawLitecoin', 'withdrawEthereum', 'withdrawRipple', 'withdrawPaxos'],
    },
  },
  default: '',
  description: 'Cryptocurrency address',
},
{
  displayName: 'Instant',
  name: 'instant',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawBitcoin'],
    },
  },
  default: false,
  description: 'Whether to use instant withdrawal',
},
{
  displayName: 'Destination Tag',
  name: 'destination_tag',
  type: 'string',
  required: false,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawRipple'] 
    } 
  },
  default: '',
  description: 'Destination tag for XRP withdrawal',
},
{
  displayName: 'Account Currency',
  name: 'account_currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawFiat'],
    },
  },
  default: 'EUR',
  description: 'Account currency (e.g., EUR, USD)',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawFiat'],
    },
  },
  default: '',
  description: 'Beneficiary name',
},
{
  displayName: 'IBAN',
  name: 'iban',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawFiat'],
    },
  },
  default: '',
  description: 'International Bank Account Number',
},
{
  displayName: 'BIC',
  name: 'bic',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['withdrawFiat'],
    },
  },
  default: '',
  description: 'Bank Identifier Code',
},
{
  displayName: 'Address',
  name: 'bankAddress',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Account holder address',
},
{
  displayName: 'Postal Code',
  name: 'postal_code',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Postal code',
},
{
  displayName: 'City',
  name: 'city',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'City',
},
{
  displayName: 'Country',
  name: 'country',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Country',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Withdrawal type',
},
{
  displayName: 'Bank Name',
  name: 'bank_name',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Bank name',
},
{
  displayName: 'Bank Address',
  name: 'bank_address',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Bank address',
},
{
  displayName: 'Bank Postal Code',
  name: 'bank_postal_code',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Bank postal code',
},
{
  displayName: 'Bank City',
  name: 'bank_city',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Bank city',
},
{
  displayName: 'Bank Country',
  name: 'bank_country',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Bank country',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Currency',
},
{
  displayName: 'Comment',
  name: 'comment',
  type: 'string',
  required: false,
  displayOptions: { 
    show: { 
      resource: ['withdrawals'], 
      operation: ['withdrawFiat'] 
    } 
  },
  default: '',
  description: 'Optional comment',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deposits', 'transfer'],
      operation: ['transferToMain', 'transferFromMain'],
    },
  },
  default: '',
  description: 'The amount to transfer',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deposits', 'transfer'],
      operation: ['transferToMain', 'transferFromMain'],
    },
  },
  default: '',
  description: 'The currency to transfer (e.g., BTC, ETH, USD)',
},
{
  displayName: 'Sub Account',
  name: 'subaccount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deposits', 'transfer'],
      operation: ['transferToMain', 'transferFromMain'],
    },
  },
  default: '',
  description: 'The sub account identifier',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'tradingPairs':
        return [await executeTradingPairsOperations.call(this, items)];
      case 'orders':
        return [await executeOrdersOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'withdrawals':
        return [await executeWithdrawalsOperations.call(this, items)];
      case 'deposits':
        return [await executeDepositsOperations.call(this, items)];
      case 'transfer':
        return [await executeTransferOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

function generateNonce(): string {
  return Date.now().toString();
}

function generateSignature(nonce: string, customerId: string, apiKey: string, apiSecret: string): string {
  const message = nonce + customerId + apiKey;
  return createHmac('sha256', apiSecret).update(message).digest('hex').toUpperCase();
}

async function executeTradingPairsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitstampApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllTradingPairs': {
          const options: any = {
            method: 'GET',
            url: 'https://www.bitstamp.net/api/v2/trading-pairs-info/',
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTicker': {
          const pair = this.getNodeParameter('pair', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `https://www.bitstamp.net/api/v2/ticker/${pair}/`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAllTickers': {
          const options: any = {
            method: 'GET',
            url: `https://www.bitstamp.net/api/v2/ticker/`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getHourlyTicker': {
          const pair = this.getNodeParameter('pair', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `https://www.bitstamp.net/api/v2/ticker_hour/${pair}/`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrderBook': {
          const pair = this.getNodeParameter('pair', i) as string;
          const group = this.getNodeParameter('group', i, '1') as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('group', group);
          
          const options: any = {
            method: 'GET',
            url: `https://www.bitstamp.net/api/v2/order_book/${pair}/?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTransactions': {
          const pair = this.getNodeParameter('pair', i) as string;
          const time = this.getNodeParameter('time', i, 'hour') as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('time', time);
          
          const options: any = {
            method: 'GET',
            url: `https://www.bitstamp.net/api/v2/transactions/${pair}/?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ 
        json: result, 
        pairedItem: { item: i } 
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeOrdersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitstampApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = generateNonce();
      const signature = generateSignature(nonce, credentials.customerId, credentials.apiKey, credentials.apiSecret);

      const baseParams = new URLSearchParams({
        key: credentials.apiKey,
        signature: signature,
        nonce: nonce,
      });

      switch (operation) {
        case 'createBuyOrder': {
          const pair = this.getNodeParameter('pair', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const price = this.getNodeParameter('price', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const timeInForce = this.getNodeParameter('timeInForce', i) as string;
          const limitPrice = this.getNodeParameter('limitPrice', i, 0) as number;
          const dailyOrder = this.getNodeParameter('dailyOrder', i, false) as boolean;

          baseParams.append('amount', amount);
          baseParams.append('price', price);
          if (type) baseParams.append('type', type);
          if (timeInForce) baseParams.append('time_in_force', timeInForce);
          if (limitPrice > 0) baseParams.append('limit_price', limitPrice.toString());
          if (dailyOrder) baseParams.append('daily_order', 'True');

          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/buy/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSellOrder': {
          const pair = this.getNodeParameter('pair', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const price = this.getNodeParameter('price', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const timeInForce = this.getNodeParameter('timeInForce', i) as string;
          const limitPrice = this.getNodeParameter('limitPrice', i, 0) as number;
          const dailyOrder = this.getNodeParameter('dailyOrder', i, false) as boolean;

          baseParams.append('amount', amount);
          baseParams.append('price', price);
          if (type) baseParams.append('type', type);
          if (timeInForce) baseParams.append('time_in_force', timeInForce);
          if (limitPrice > 0) baseParams.append('limit_price', limitPrice.toString());
          if (dailyOrder) baseParams.append('daily_order', 'True');

          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/sell/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createMarketBuyOrder': {
          const pair = this.getNodeParameter('pair', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          baseParams.append('amount', amount);

          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/buy/market/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createMarketSellOrder': {
          const pair = this.getNodeParameter('pair', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          baseParams.append('amount', amount);

          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/sell/market/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          baseParams.append('id', orderId);

          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/cancel_order/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelAllOrders': {
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/cancel_all_orders/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOpenOrders': {
          const pair = this.getNodeParameter('pair', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/open_orders/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllOpenOrders': {
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/open_orders/all/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPairOpenOrders': {
          const pair = this.getNodeParameter('pair', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/open_orders/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrderStatus': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          baseParams.append('id', orderId);

          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/order_status/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: baseParams.toString(),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body as any);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitstampApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const nonce = generateNonce();
      const signature = generateSignature(nonce, credentials.customerId, credentials.apiKey, credentials.apiSecret);
      
      const baseData = {
        key: credentials.apiKey,
        signature: signature,
        nonce: nonce,
      };

      switch (operation) {
        case 'getBalance': {
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/balance/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: baseData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPairBalance': {
          const pair = this.getNodeParameter('pair', i) as string;
          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/balance/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: baseData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getUserTransactions': {
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const sort = this.getNodeParameter('sort', i, 'desc') as string;
          const since = this.getNodeParameter('since', i, '') as string;
          const type = this.getNodeParameter('type', i, '') as string;
          
          const formData = {
            ...baseData,
            offset: offset.toString(),
            limit: limit.toString(),
            sort: sort,
          };
          
          if (since) formData.since = since;
          if (type) formData.type = type;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/user_transactions/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: formData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPairTransactions': {
          const pair = this.getNodeParameter('pair', i) as string;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const sort = this.getNodeParameter('sort', i, 'desc') as string;
          const since = this.getNodeParameter('since', i, '') as string;
          
          const formData = {
            ...baseData,
            offset: offset.toString(),
            limit: limit.toString(),
            sort: sort,
          };
          
          if (since) formData.since = since;
          
          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/user_transactions/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: formData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTradingFees': {
          const pair = this.getNodeParameter('pair', i) as string;
          const options: any = {
            method: 'POST',
            url: `https://www.bitstamp.net/api/v2/trading-fees/${pair}/`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: baseData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

function createSignature(apiSecret: string, nonce: string, customerId: string, apiKey: string, postData: string): string {
  const message = nonce + customerId + apiKey + postData;
  return crypto.createHmac('sha256', apiSecret).update(message).digest('hex').toUpperCase();
}

async function executeWithdrawalsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitstampApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now().toString();
      
      switch (operation) {
        case 'getWithdrawalRequests': {
          const timedelta = this.getNodeParameter('timedelta', i) as number;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&timedelta=${timedelta}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/withdrawal-requests/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOpenWithdrawals': {
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/withdrawal/open/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getWithdrawalStatus': {
          const id = this.getNodeParameter('id', i) as string;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&id=${id}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/withdrawal/status/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelWithdrawal': {
          const id = this.getNodeParameter('id', i) as string;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&id=${id}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/withdrawal/cancel/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'withdrawBitcoin': {
          const amount = this.getNodeParameter('amount', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const instant = this.getNodeParameter('instant', i) as boolean;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&amount=${amount}&address=${address}&instant=${instant ? '1' : '0'}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/btc_withdrawal/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'withdrawLitecoin': {
          const amount = this.getNodeParameter('amount', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&amount=${amount}&address=${address}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/ltc_withdrawal/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'withdrawEthereum': {
          const amount = this.getNodeParameter('amount', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&amount=${amount}&address=${address}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/eth_withdrawal/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'withdrawRipple': {
          const amount = this.getNodeParameter('amount', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const destinationTag = this.getNodeParameter('destination_tag', i, '') as string;
          
          let postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&amount=${amount}&address=${address}`;
          if (destinationTag) {
            postData += `&destination_tag=${destinationTag}`;
          }
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/xrp_withdrawal/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'withdrawPaxos': {
          const amount = this.getNodeParameter('amount', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&amount=${amount}&address=${address}`;
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/pax_withdrawal/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'withdrawFiat': {
          const amount = this.getNodeParameter('amount', i) as string;
          const account_currency = this.getNodeParameter('account_currency', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const iban = this.getNodeParameter('iban', i) as string;
          const bic = this.getNodeParameter('bic', i) as string;
          const bankAddress = this.getNodeParameter('bankAddress', i) as string;
          const postalCode = this.getNodeParameter('postal_code', i) as string;
          const city = this.getNodeParameter('city', i) as string;
          const country = this.getNodeParameter('country', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const bankName = this.getNodeParameter('bank_name', i) as string;
          const bankAddressField = this.getNodeParameter('bank_address', i) as string;
          const bankPostalCode = this.getNodeParameter('bank_postal_code', i) as string;
          const bankCity = this.getNodeParameter('bank_city', i) as string;
          const bankCountry = this.getNodeParameter('bank_country', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;
          const comment = this.getNodeParameter('comment', i, '') as string;
          
          let postData = `key=${credentials.apiKey}&signature=${createSignature(credentials.apiSecret, nonce, credentials.customerId, credentials.apiKey, '')}&nonce=${nonce}&amount=${amount}&account_currency=${account_currency}&name=${name}&iban=${iban}&bic=${bic}&address=${bankAddress}&postal_code=${postalCode}&city=${city}&country=${country}&type=${type}&bank_name=${bankName}&bank_address=${bankAddressField}&bank_postal_code=${bankPostalCode}&bank_city=${bankCity}&bank_country=${bankCountry}&currency=${currency}`;
          
          if (comment) {
            postData += `&comment=${comment}`;
          }
          
          const options: any = {
            method: 'POST',
            url: 'https://www.bitstamp.net/api/v2/bank_withdrawal/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continue