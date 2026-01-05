/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';
import type { IBitstampCredentials, IBitstampErrorResponse } from './types/BitstampTypes';

const BASE_URL = 'https://www.bitstamp.net/api/v2';

// License notice logged once per node load
let licenseNoticeLogged = false;

/**
 * Log the Velocity BPA licensing notice (once per node load)
 */
export function logLicenseNotice(context: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions): void {
	if (!licenseNoticeLogged) {
		context.logger.warn(
			'[Velocity BPA Licensing Notice] ' +
			'This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
			'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
			'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.'
		);
		licenseNoticeLogged = true;
	}
}

/**
 * Generate HMAC-SHA256 signature for Bitstamp API authentication
 */
export function generateSignature(
	nonce: string,
	clientId: string,
	apiKey: string,
	apiSecret: string,
): string {
	const message = nonce + clientId + apiKey;
	return crypto
		.createHmac('sha256', apiSecret)
		.update(message)
		.digest('hex')
		.toUpperCase();
}

/**
 * Check if response contains a Bitstamp error
 */
function isBitstampError(response: unknown): response is IBitstampErrorResponse {
	return (
		typeof response === 'object' &&
		response !== null &&
		'status' in response &&
		(response as IBitstampErrorResponse).status === 'error'
	);
}

/**
 * Extract error message from Bitstamp error response
 */
function extractErrorMessage(error: IBitstampErrorResponse): string {
	if (error.reason) {
		if (error.reason.__all__) {
			return error.reason.__all__.join(', ');
		}
		const messages: string[] = [];
		for (const [key, value] of Object.entries(error.reason)) {
			if (value && Array.isArray(value)) {
				messages.push(`${key}: ${value.join(', ')}`);
			}
		}
		return messages.join('; ') || 'Unknown error';
	}
	return 'Unknown error';
}

/**
 * Make an authenticated request to the Bitstamp API (private endpoints)
 */
export async function bitstampApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	isPublic = false,
): Promise<IDataObject | IDataObject[]> {
	const url = `${BASE_URL}/${endpoint}/`;

	if (isPublic) {
		const options: IHttpRequestOptions = {
			method: 'GET',
			url,
			json: true,
		};

		try {
			const response = await this.helpers.httpRequest(options);
			
			if (isBitstampError(response)) {
				throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
					message: extractErrorMessage(response),
				});
			}
			
			return response as IDataObject | IDataObject[];
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	const credentials = (await this.getCredentials('bitstampApi')) as unknown as IBitstampCredentials;
	const nonce = Date.now().toString();
	const signature = generateSignature(
		nonce,
		credentials.clientId,
		credentials.apiKey,
		credentials.apiSecret,
	);

	const formData: IDataObject = {
		key: credentials.apiKey,
		signature,
		nonce,
		...body,
	};

	const options: IHttpRequestOptions = {
		method: method === 'GET' ? 'POST' : method,
		url,
		body: formData,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		json: true,
	};

	try {
		const response = await this.helpers.httpRequest(options);
		
		if (isBitstampError(response)) {
			throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
				message: extractErrorMessage(response),
			});
		}
		
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make a paginated request to the Bitstamp API
 */
export async function bitstampApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	isPublic = false,
	limit = 1000,
): Promise<IDataObject[]> {
	const allItems: IDataObject[] = [];
	let offset = 0;
	let hasMore = true;

	while (hasMore) {
		const requestBody: IDataObject = {
			...body,
			offset,
			limit,
		};

		const response = await bitstampApiRequest.call(
			this,
			method,
			endpoint,
			requestBody,
			isPublic,
		);

		const items = Array.isArray(response) ? response : [response];
		allItems.push(...items);

		if (items.length < limit) {
			hasMore = false;
		} else {
			offset += limit;
		}
	}

	return allItems;
}

/**
 * Format trading pair to lowercase (Bitstamp format)
 */
export function formatTradingPair(pair: string): string {
	return pair.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Build output data from response
 */
export function buildReturnData(
	_items: INodeExecutionData[],
	response: IDataObject | IDataObject[],
	itemIndex: number,
): INodeExecutionData[] {
	const returnData: INodeExecutionData[] = [];
	
	if (Array.isArray(response)) {
		for (const item of response) {
			returnData.push({
				json: item,
				pairedItem: { item: itemIndex },
			});
		}
	} else {
		returnData.push({
			json: response,
			pairedItem: { item: itemIndex },
		});
	}
	
	return returnData;
}

/**
 * Convert amount to string with proper precision
 */
export function formatAmount(amount: number | string): string {
	if (typeof amount === 'string') {
		return amount;
	}
	return amount.toString();
}

/**
 * Validate currency pair format
 */
export function validateCurrencyPair(pair: string): boolean {
	const validPattern = /^[a-z]{3,5}[a-z]{3,5}$/;
	return validPattern.test(pair.toLowerCase());
}

/**
 * Get supported currencies list
 */
export function getSupportedCurrencies(): string[] {
	return [
		'btc', 'eth', 'ltc', 'xrp', 'bch', 'xlm', 'link', 'omg',
		'usdc', 'pax', 'aave', 'algo', 'audio', 'bat', 'comp',
		'crv', 'dai', 'enj', 'grt', 'knc', 'mkr', 'matic',
		'perp', 'ren', 'sand', 'shib', 'snx', 'sol', 'sushi',
		'uma', 'uni', 'wbtc', 'yfi', 'zrx', 'eur', 'usd', 'gbp',
	];
}

/**
 * Get OHLC step values
 */
export function getOHLCSteps(): { name: string; value: number }[] {
	return [
		{ name: '1 Minute', value: 60 },
		{ name: '3 Minutes', value: 180 },
		{ name: '5 Minutes', value: 300 },
		{ name: '15 Minutes', value: 900 },
		{ name: '30 Minutes', value: 1800 },
		{ name: '1 Hour', value: 3600 },
		{ name: '2 Hours', value: 7200 },
		{ name: '4 Hours', value: 14400 },
		{ name: '6 Hours', value: 21600 },
		{ name: '12 Hours', value: 43200 },
		{ name: '1 Day', value: 86400 },
		{ name: '3 Days', value: 259200 },
	];
}
