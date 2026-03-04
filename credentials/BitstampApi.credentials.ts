import {
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
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for Bitstamp API access',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API secret for Bitstamp API access',
		},
		{
			displayName: 'Customer ID',
			name: 'customerId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Bitstamp customer ID (username)',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.bitstamp.net/api/v2',
			required: true,
			description: 'The base URL for the Bitstamp API',
		},
	];
}