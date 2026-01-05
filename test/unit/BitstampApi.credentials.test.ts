/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { BitstampApi } from '../../credentials/BitstampApi.credentials';

describe('BitstampApi Credentials', () => {
	let credentials: BitstampApi;

	beforeEach(() => {
		credentials = new BitstampApi();
	});

	describe('Credential Properties', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('bitstampApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Bitstamp API');
		});

		it('should have documentation URL', () => {
			expect(credentials.documentationUrl).toBe('https://www.bitstamp.net/api/');
		});

		it('should have three required properties', () => {
			expect(credentials.properties).toHaveLength(3);
		});
	});

	describe('API Key Property', () => {
		it('should have correct configuration', () => {
			const apiKey = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKey).toBeDefined();
			expect(apiKey!.displayName).toBe('API Key');
			expect(apiKey!.type).toBe('string');
			expect(apiKey!.required).toBe(true);
		});
	});

	describe('API Secret Property', () => {
		it('should have correct configuration', () => {
			const apiSecret = credentials.properties.find((p) => p.name === 'apiSecret');
			expect(apiSecret).toBeDefined();
			expect(apiSecret!.displayName).toBe('API Secret');
			expect(apiSecret!.type).toBe('string');
			expect(apiSecret!.typeOptions?.password).toBe(true);
			expect(apiSecret!.required).toBe(true);
		});
	});

	describe('Client ID Property', () => {
		it('should have correct configuration', () => {
			const clientId = credentials.properties.find((p) => p.name === 'clientId');
			expect(clientId).toBeDefined();
			expect(clientId!.displayName).toBe('Client ID');
			expect(clientId!.type).toBe('string');
			expect(clientId!.required).toBe(true);
		});
	});

	describe('Test Request', () => {
		it('should have a test request configuration', () => {
			expect(credentials.test).toBeDefined();
			expect(credentials.test.request).toBeDefined();
		});

		it('should test against a public endpoint', () => {
			expect(credentials.test.request.baseURL).toBe('https://www.bitstamp.net/api/v2');
			expect(credentials.test.request.url).toBe('/ticker/btcusd/');
			expect(credentials.test.request.method).toBe('GET');
		});
	});
});
