/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Bitstamp } from '../../nodes/Bitstamp/Bitstamp.node';

describe('Bitstamp Node', () => {
	let node: Bitstamp;

	beforeEach(() => {
		node = new Bitstamp();
	});

	describe('Node Description', () => {
		it('should have correct basic properties', () => {
			expect(node.description.displayName).toBe('Bitstamp');
			expect(node.description.name).toBe('bitstamp');
			expect(node.description.version).toBe(1);
			expect(node.description.group).toContain('transform');
		});

		it('should have an icon', () => {
			expect(node.description.icon).toBe('file:bitstamp.svg');
		});

		it('should have correct input/output configuration', () => {
			expect(node.description.inputs).toBeDefined();
			expect(node.description.outputs).toBeDefined();
		});

		it('should have credential configuration', () => {
			expect(node.description.credentials).toBeDefined();
			expect(node.description.credentials).toHaveLength(1);
			expect(node.description.credentials![0].name).toBe('bitstampApi');
		});

		it('should have all 6 resources', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty!.type).toBe('options');

			const options = resourceProperty!.options as Array<{ value: string }>;
			const resourceValues = options.map((o) => o.value);

			expect(resourceValues).toContain('account');
			expect(resourceValues).toContain('marketData');
			expect(resourceValues).toContain('trading');
			expect(resourceValues).toContain('withdrawal');
			expect(resourceValues).toContain('deposit');
			expect(resourceValues).toContain('staking');
		});
	});

	describe('Account Operations', () => {
		it('should have all account operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('account')
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as Array<{ value: string }>;
			const operationValues = options.map((o) => o.value);

			expect(operationValues).toContain('getBalance');
			expect(operationValues).toContain('getBalanceByCurrency');
			expect(operationValues).toContain('getUserTransactions');
			expect(operationValues).toContain('getAllFees');
			expect(operationValues).toContain('getFeeByMarket');
			expect(operationValues).toContain('getAccountInfo');
		});
	});

	describe('Market Data Operations', () => {
		it('should have all market data operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('marketData')
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as Array<{ value: string }>;
			const operationValues = options.map((o) => o.value);

			expect(operationValues).toContain('getTicker');
			expect(operationValues).toContain('getHourlyTicker');
			expect(operationValues).toContain('getOrderBook');
			expect(operationValues).toContain('getTransactions');
			expect(operationValues).toContain('getOHLC');
			expect(operationValues).toContain('getTradingPairs');
			expect(operationValues).toContain('getEurUsdRate');
		});
	});

	describe('Trading Operations', () => {
		it('should have all trading operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('trading')
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as Array<{ value: string }>;
			const operationValues = options.map((o) => o.value);

			expect(operationValues).toContain('placeBuyLimitOrder');
			expect(operationValues).toContain('placeSellLimitOrder');
			expect(operationValues).toContain('placeBuyMarketOrder');
			expect(operationValues).toContain('placeSellMarketOrder');
			expect(operationValues).toContain('placeBuyInstantOrder');
			expect(operationValues).toContain('placeSellInstantOrder');
			expect(operationValues).toContain('cancelOrder');
			expect(operationValues).toContain('cancelAllOrders');
			expect(operationValues).toContain('getOpenOrders');
			expect(operationValues).toContain('getOrderStatus');
		});
	});

	describe('Withdrawal Operations', () => {
		it('should have all withdrawal operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('withdrawal')
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as Array<{ value: string }>;
			const operationValues = options.map((o) => o.value);

			expect(operationValues).toContain('getWithdrawalRequests');
			expect(operationValues).toContain('withdrawBitcoin');
			expect(operationValues).toContain('withdrawLitecoin');
			expect(operationValues).toContain('withdrawEthereum');
			expect(operationValues).toContain('withdrawRipple');
			expect(operationValues).toContain('withdrawCrypto');
			expect(operationValues).toContain('cancelWithdrawal');
		});
	});

	describe('Deposit Operations', () => {
		it('should have all deposit operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('deposit')
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as Array<{ value: string }>;
			const operationValues = options.map((o) => o.value);

			expect(operationValues).toContain('getBitcoinDepositAddress');
			expect(operationValues).toContain('getLitecoinDepositAddress');
			expect(operationValues).toContain('getEthereumDepositAddress');
			expect(operationValues).toContain('getCryptoDepositAddress');
			expect(operationValues).toContain('getUnconfirmedDeposits');
		});
	});

	describe('Staking Operations', () => {
		it('should have all staking operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('staking')
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as Array<{ value: string }>;
			const operationValues = options.map((o) => o.value);

			expect(operationValues).toContain('getStakingInfo');
			expect(operationValues).toContain('stake');
			expect(operationValues).toContain('unstake');
			expect(operationValues).toContain('getStakingTransactions');
			expect(operationValues).toContain('getStakingBalance');
		});
	});

	describe('Credential Requirements', () => {
		it('should require credentials for private endpoints', () => {
			const credentials = node.description.credentials![0];
			expect(credentials.required).toBe(true);
			
			// Should require credentials for account, trading, withdrawal, deposit, staking
			const showResources = credentials.displayOptions?.show?.resource;
			expect(showResources).toContain('account');
			expect(showResources).toContain('trading');
			expect(showResources).toContain('withdrawal');
			expect(showResources).toContain('deposit');
			expect(showResources).toContain('staking');
		});

		it('should not require credentials for market data', () => {
			const credentials = node.description.credentials![0];
			const showResources = credentials.displayOptions?.show?.resource;
			expect(showResources).not.toContain('marketData');
		});
	});
});
