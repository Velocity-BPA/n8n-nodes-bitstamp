/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	generateSignature,
	formatTradingPair,
	formatAmount,
	validateCurrencyPair,
	getSupportedCurrencies,
	getOHLCSteps,
} from '../../nodes/Bitstamp/GenericFunctions';

describe('GenericFunctions', () => {
	describe('generateSignature', () => {
		it('should generate a valid HMAC-SHA256 signature', () => {
			const nonce = '1234567890';
			const clientId = 'testClient';
			const apiKey = 'testApiKey';
			const apiSecret = 'testApiSecret';

			const signature = generateSignature(nonce, clientId, apiKey, apiSecret);

			// Signature should be uppercase hex string
			expect(signature).toMatch(/^[A-F0-9]+$/);
			// SHA256 produces 64 character hex string
			expect(signature).toHaveLength(64);
		});

		it('should produce consistent signatures for same inputs', () => {
			const nonce = '1234567890';
			const clientId = 'testClient';
			const apiKey = 'testApiKey';
			const apiSecret = 'testApiSecret';

			const signature1 = generateSignature(nonce, clientId, apiKey, apiSecret);
			const signature2 = generateSignature(nonce, clientId, apiKey, apiSecret);

			expect(signature1).toBe(signature2);
		});

		it('should produce different signatures for different inputs', () => {
			const nonce1 = '1234567890';
			const nonce2 = '1234567891';
			const clientId = 'testClient';
			const apiKey = 'testApiKey';
			const apiSecret = 'testApiSecret';

			const signature1 = generateSignature(nonce1, clientId, apiKey, apiSecret);
			const signature2 = generateSignature(nonce2, clientId, apiKey, apiSecret);

			expect(signature1).not.toBe(signature2);
		});
	});

	describe('formatTradingPair', () => {
		it('should convert trading pair to lowercase', () => {
			expect(formatTradingPair('BTCUSD')).toBe('btcusd');
			expect(formatTradingPair('BtcUsd')).toBe('btcusd');
		});

		it('should remove non-alphanumeric characters', () => {
			expect(formatTradingPair('BTC/USD')).toBe('btcusd');
			expect(formatTradingPair('BTC-USD')).toBe('btcusd');
			expect(formatTradingPair('BTC_USD')).toBe('btcusd');
		});

		it('should handle already formatted pairs', () => {
			expect(formatTradingPair('btcusd')).toBe('btcusd');
			expect(formatTradingPair('ethusd')).toBe('ethusd');
		});
	});

	describe('formatAmount', () => {
		it('should return string as-is', () => {
			expect(formatAmount('123.456')).toBe('123.456');
			expect(formatAmount('0.00001')).toBe('0.00001');
		});

		it('should convert number to string', () => {
			expect(formatAmount(123.456)).toBe('123.456');
			expect(formatAmount(0.00001)).toBe('0.00001');
		});

		it('should handle integer values', () => {
			expect(formatAmount(100)).toBe('100');
			expect(formatAmount('100')).toBe('100');
		});
	});

	describe('validateCurrencyPair', () => {
		it('should return true for valid pairs', () => {
			expect(validateCurrencyPair('btcusd')).toBe(true);
			expect(validateCurrencyPair('ethusd')).toBe(true);
			expect(validateCurrencyPair('BTCUSD')).toBe(true);
		});

		it('should return false for invalid pairs', () => {
			expect(validateCurrencyPair('btc')).toBe(false);
			expect(validateCurrencyPair('123456')).toBe(false);
			expect(validateCurrencyPair('')).toBe(false);
		});
	});

	describe('getSupportedCurrencies', () => {
		it('should return an array of currencies', () => {
			const currencies = getSupportedCurrencies();
			expect(Array.isArray(currencies)).toBe(true);
			expect(currencies.length).toBeGreaterThan(0);
		});

		it('should include major currencies', () => {
			const currencies = getSupportedCurrencies();
			expect(currencies).toContain('btc');
			expect(currencies).toContain('eth');
			expect(currencies).toContain('usd');
			expect(currencies).toContain('eur');
		});
	});

	describe('getOHLCSteps', () => {
		it('should return an array of step options', () => {
			const steps = getOHLCSteps();
			expect(Array.isArray(steps)).toBe(true);
			expect(steps.length).toBeGreaterThan(0);
		});

		it('should include common timeframes', () => {
			const steps = getOHLCSteps();
			const values = steps.map((s) => s.value);
			
			expect(values).toContain(60);     // 1 minute
			expect(values).toContain(3600);   // 1 hour
			expect(values).toContain(86400);  // 1 day
		});

		it('should have name and value for each step', () => {
			const steps = getOHLCSteps();
			steps.forEach((step) => {
				expect(step).toHaveProperty('name');
				expect(step).toHaveProperty('value');
				expect(typeof step.name).toBe('string');
				expect(typeof step.value).toBe('number');
			});
		});
	});
});
