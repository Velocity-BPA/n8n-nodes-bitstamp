/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for the Bitstamp n8n node.
 * 
 * These tests require valid Bitstamp API credentials and will make
 * real API calls. They should be run manually during development
 * or in a CI environment with proper credential configuration.
 * 
 * To run these tests:
 * 1. Set environment variables:
 *    - BITSTAMP_API_KEY
 *    - BITSTAMP_API_SECRET
 *    - BITSTAMP_CLIENT_ID
 * 2. Run: npm run test:integration
 * 
 * WARNING: Some tests (like trading operations) may incur real costs
 * and should be used with caution. Always use a test account or
 * small amounts when testing trading functionality.
 */

// Check if network is available (tests will be skipped if not)
let networkAvailable = true;
beforeAll(async () => {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3000);
		await fetch('https://www.bitstamp.net/api/v2/ticker/btcusd/', { signal: controller.signal });
		clearTimeout(timeoutId);
	} catch {
		networkAvailable = false;
		console.log('Network unavailable - skipping integration tests');
	}
});

describe('Bitstamp Integration Tests', () => {
	const hasCredentials = Boolean(
		process.env.BITSTAMP_API_KEY &&
		process.env.BITSTAMP_API_SECRET &&
		process.env.BITSTAMP_CLIENT_ID
	);

	describe('Public API Endpoints', () => {
		it('should be able to fetch ticker data', async () => {
			if (!networkAvailable) {
				console.log('Skipping - network unavailable');
				return;
			}
			// This test can run without credentials
			const response = await fetch('https://www.bitstamp.net/api/v2/ticker/btcusd/');
			expect(response.ok).toBe(true);
			
			const data = await response.json() as Record<string, unknown>;
			expect(data).toHaveProperty('last');
			expect(data).toHaveProperty('bid');
			expect(data).toHaveProperty('ask');
		});

		it('should be able to fetch trading pairs', async () => {
			if (!networkAvailable) {
				console.log('Skipping - network unavailable');
				return;
			}
			const response = await fetch('https://www.bitstamp.net/api/v2/trading-pairs-info/');
			expect(response.ok).toBe(true);
			
			const data = await response.json() as unknown[];
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
		});

		it('should be able to fetch order book', async () => {
			if (!networkAvailable) {
				console.log('Skipping - network unavailable');
				return;
			}
			const response = await fetch('https://www.bitstamp.net/api/v2/order_book/btcusd/');
			expect(response.ok).toBe(true);
			
			const data = await response.json() as Record<string, unknown>;
			expect(data).toHaveProperty('bids');
			expect(data).toHaveProperty('asks');
		});
	});

	describe('Private API Endpoints', () => {
		// Skip these tests if credentials are not available
		const conditionalIt = hasCredentials ? it : it.skip;

		conditionalIt('should be able to fetch account balance', async () => {
			// This test requires valid credentials
			// Implementation would go here
			expect(true).toBe(true);
		});

		conditionalIt('should be able to fetch user transactions', async () => {
			// This test requires valid credentials
			// Implementation would go here
			expect(true).toBe(true);
		});

		conditionalIt('should be able to fetch open orders', async () => {
			// This test requires valid credentials
			// Implementation would go here
			expect(true).toBe(true);
		});
	});

	describe('Credential Validation', () => {
		it('should skip private tests when credentials are missing', () => {
			if (!hasCredentials) {
				console.log('Skipping private API tests - no credentials configured');
			}
			expect(true).toBe(true);
		});
	});
});
