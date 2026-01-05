/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BitstampApi implements ICredentialType {
	name = 'bitstampApi';
	displayName = 'Bitstamp API';
	documentationUrl = 'https://www.bitstamp.net/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Bitstamp API key',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Bitstamp API secret',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Bitstamp customer/user ID',
		},
	];

	// Note: Bitstamp uses custom HMAC-SHA256 authentication
	// Authentication is handled in GenericFunctions.ts
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.bitstamp.net/api/v2',
			url: '/ticker/btcusd/',
			method: 'GET',
		},
	};
}
