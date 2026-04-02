/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Bitstamp } from '../nodes/Bitstamp/Bitstamp.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Bitstamp Node', () => {
  let node: Bitstamp;

  beforeAll(() => {
    node = new Bitstamp();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Bitstamp');
      expect(node.description.name).toBe('bitstamp');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('TradingPair Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        customerId: 'test-customer',
        baseUrl: 'https://www.bitstamp.net/api/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });
  
  describe('getTradingPairs operation', () => {
    it('should get all trading pairs successfully', async () => {
      const mockResponse = [{ name: 'BTC/USD', url_symbol: 'btcusd' }];
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTradingPairs');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
    
    it('should handle getTradingPairs error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTradingPairs');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result[0].json.error).toBe('API Error');
    });
  });
  
  describe('getTicker operation', () => {
    it('should get ticker for specific pair successfully', async () => {
      const mockResponse = { last: '50000', bid: '49950', ask: '50050' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTicker')
        .mockReturnValueOnce('btcusd');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
  
  describe('getAllTickers operation', () => {
    it('should get all tickers successfully', async () => {
      const mockResponse = { btcusd: { last: '50000' }, ethusd: { last: '3000' } };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllTickers');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
  
  describe('getOrderBook operation', () => {
    it('should get order book successfully', async () => {
      const mockResponse = { bids: [['50000', '1.0']], asks: [['50100', '0.5']] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOrderBook')
        .mockReturnValueOnce('btcusd')
        .mockReturnValueOnce('0');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
    
    it('should handle getOrderBook error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOrderBook')
        .mockReturnValueOnce('btcusd')
        .mockReturnValueOnce('0');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Order book error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result[0].json.error).toBe('Order book error');
    });
  });
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        customerId: 'test-customer-id',
        baseUrl: 'https://www.bitstamp.net/api/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBalance');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ btc_balance: '1.0', usd_balance: '1000.0' });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { btc_balance: '1.0', usd_balance: '1000.0' }, pairedItem: { item: 0 } }]);
  });

  it('should handle get balance error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBalance');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should get pair balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getPairBalance';
      if (param === 'pair') return 'btcusd';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ btc_balance: '1.0', usd_balance: '1000.0' });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { btc_balance: '1.0', usd_balance: '1000.0' }, pairedItem: { item: 0 } }]);
  });

  it('should get user transactions successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'getUserTransactions';
      if (param === 'offset') return defaultValue || 0;
      if (param === 'limit') return defaultValue || 100;
      if (param === 'sort') return defaultValue || 'desc';
      return defaultValue || '';
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ id: '123', type: 2 }]);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: [{ id: '123', type: 2 }], pairedItem: { item: 0 } }]);
  });

  it('should get pair transactions successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'getPairTransactions';
      if (param === 'pair') return 'btcusd';
      if (param === 'offset') return defaultValue || 0;
      if (param === 'limit') return defaultValue || 100;
      if (param === 'sort') return defaultValue || 'desc';
      return defaultValue || '';
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ id: '456', type: 2, btc: '0.1' }]);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: [{ id: '456', type: 2, btc: '0.1' }], pairedItem: { item: 0 } }]);
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        customerId: 'test-customer-id',
        baseUrl: 'https://www.bitstamp.net/api/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      },
    };
  });

  it('should create a buy order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createBuyOrder')
      .mockReturnValueOnce('btcusd')
      .mockReturnValueOnce(0.001)
      .mockReturnValueOnce(50000)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: '12345',
      datetime: '2023-01-01 12:00:00',
      type: '0',
      price: '50000',
      amount: '0.001'
    });

    const items = [{ json: {} }];
    const result = await executeOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('12345');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/buy/btcusd/',
        form: expect.objectContaining({
          amount: '0.001',
          price: '50000'
        })
      })
    );
  });

  it('should cancel an order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelOrder')
      .mockReturnValueOnce('12345');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: '12345',
      amount: '0.001',
      price: '50000',
      type: '0'
    });

    const items = [{ json: {} }];
    const result = await executeOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('12345');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/cancel_order/',
        form: expect.objectContaining({
          id: '12345'
        })
      })
    );
  });

  it('should get all open orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllOpenOrders');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
      {
        id: '12345',
        datetime: '2023-01-01 12:00:00',
        type: '0',
        price: '50000',
        amount: '0.001',
        currency_pair: 'BTC/USD'
      }
    ]);

    const items = [{ json: {} }];
    const result = await executeOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(Array.isArray(result[0].json)).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/open_orders/all/'
      })
    );
  });

  it('should handle errors when continuing on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createBuyOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when not continuing on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createBuyOrder');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    await expect(executeOrderOperations.call(mockExecuteFunctions, items)).rejects.toThrow('API Error');
  });
});

describe('Withdrawal Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				apiSecret: 'test-secret',
				customerId: 'test-customer',
				baseUrl: 'https://www.bitstamp.net/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get withdrawal requests successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getWithdrawalRequests';
			if (param === 'timedelta') return 86400;
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
			{ id: 1, amount: '100.00', currency: 'USD' },
		]);

		const result = await executeWithdrawalOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual([
			{ id: 1, amount: '100.00', currency: 'USD' },
		]);
	});

	it('should withdraw Bitcoin successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'withdrawBitcoin';
			if (param === 'amount') return '0.01';
			if (param === 'address') return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
			if (param === 'instant') return false;
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'withdrawal123',
			status: 'pending',
		});

		const result = await executeWithdrawalOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			id: 'withdrawal123',
			status: 'pending',
		});
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getWithdrawalRequests';
			return undefined;
		});

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		await expect(
			executeWithdrawalOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getWithdrawalRequests';
			return undefined;
		});

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		const result = await executeWithdrawalOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});
});

describe('Deposit Resource', () => {
  let mockExecuteFunctions: any;
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        apiSecret: 'test-secret',
        customerId: 'test-customer-id',
        baseUrl: 'https://www.bitstamp.net/api'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get Bitcoin address successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBitcoinAddress');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}');
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" });
  });

  it('should get Litecoin address successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getLitecoinAddress');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"address": "LQTpS3VaEw7JzqJkQbR6qJgJzJ8q8q8q8q"}');
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ address: "LQTpS3VaEw7JzqJkQbR6qJgJzJ8q8q8q8q" });
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBitcoinAddress');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw error when operation is unknown', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');
    
    const items = [{ json: {} }];
    
    await expect(executeDepositOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transfer Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				apiSecret: 'test-secret',
				customerId: 'test-customer-id',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('transferToMain', () => {
		it('should transfer funds to main account successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('transferToMain')
				.mockReturnValueOnce('100')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('sub123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				status: 'Complete',
				amount: '100',
				currency: 'USD',
			});

			const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('status', 'Complete');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://www.bitstamp.net/api/v2/transfer-to-main/',
				})
			);
		});

		it('should handle transfer to main errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('transferToMain')
				.mockReturnValueOnce('100')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('sub123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transfer failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('error', 'Transfer failed');
		});
	});

	describe('transferFromMain', () => {
		it('should transfer funds from main account successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('transferFromMain')
				.mockReturnValueOnce('50')
				.mockReturnValueOnce('BTC')
				.mockReturnValueOnce('sub456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				status: 'Complete',
				amount: '50',
				currency: 'BTC',
			});

			const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('status', 'Complete');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://www.bitstamp.net/api/v2/transfer-from-main/',
				})
			);
		});
	});

	describe('getSubAccounts', () => {
		it('should retrieve sub-accounts successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSubAccounts');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
				{ id: 'sub123', name: 'Sub Account 1' },
				{ id: 'sub456', name: 'Sub Account 2' },
			]);

			const result = await executeTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveLength(2);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://www.bitstamp.net/api/v2/sub-account/',
				})
			);
		});
	});
});
});
