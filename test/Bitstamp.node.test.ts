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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
describe('TradingPairs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        customerId: 'test-customer-id',
        apiSecret: 'test-api-secret',
        baseUrl: 'https://www.bitstamp.net/api/v2',
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

  test('should get all trading pairs successfully', async () => {
    const mockResponse = [
      {
        name: 'BTC/USD',
        url_symbol: 'btcusd',
        base_decimals: 8,
        counter_decimals: 2,
        minimum_order: '25.0 USD',
        trading: 'Enabled',
        instant_and_market_orders: 'Enabled',
        description: 'Bitcoin / U.S. dollar'
      }
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getAllTradingPairs';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTradingPairsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.bitstamp.net/api/v2/trading-pairs-info/',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get ticker for specific pair successfully', async () => {
    const mockResponse = {
      high: '50000',
      last: '49500',
      timestamp: '1640995200',
      bid: '49400',
      vwap: '49700',
      volume: '100.5',
      low: '48000',
      ask: '49600',
      open: '49000'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTicker';
      if (param === 'pair') return 'btcusd';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTradingPairsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.bitstamp.net/api/v2/ticker/btcusd/',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get order book successfully', async () => {
    const mockResponse = {
      timestamp: '1640995200',
      microtimestamp: '1640995200000000',
      bids: [
        ['49400', '0.5'],
        ['49300', '1.2']
      ],
      asks: [
        ['49600', '0.8'],
        ['49700', '2.1']
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getOrderBook';
      if (param === 'pair') return 'btcusd';
      if (param === 'group') return '1';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTradingPairsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.bitstamp.net/api/v2/order_book/btcusd/?group=1',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTicker';
      if (param === 'pair') return 'invalid';
      return undefined;
    });

    const error = new Error('API Error: Invalid trading pair');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeTradingPairsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error: Invalid trading pair' });
  });

  test('should get transactions successfully', async () => {
    const mockResponse = [
      {
        date: '1640995200',
        tid: '12345',
        amount: '0.5',
        type: '0',
        price: '49500'
      }
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTransactions';
      if (param === 'pair') return 'btcusd';
      if (param === 'time') return 'hour';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTradingPairsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.bitstamp.net/api/v2/transactions/btcusd/?time=hour',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });
});

describe('Orders Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        clientId: 'test-client-id',
        baseUrl: 'https://www.bitstamp.net/api/v2',
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

  test('should create buy order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'createBuyOrder',
        pair: 'btcusd',
        amount: '0.001',
        price: '50000',
        type: 'limit',
        timeInForce: 'GTC',
      };
      return params[param];
    });

    const mockResponse = { id: '12345', status: 'Open' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/buy/btcusd/',
      })
    );
  });

  test('should create sell order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'createSellOrder',
        pair: 'btcusd',
        amount: '0.001',
        price: '50000',
        type: 'limit',
        timeInForce: 'GTC',
      };
      return params[param];
    });

    const mockResponse = { id: '12346', status: 'Open' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should create market buy order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'createMarketBuyOrder',
        pair: 'btcusd',
        amount: '0.001',
      };
      return params[param];
    });

    const mockResponse = { id: '12347', status: 'Finished' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/buy/market/btcusd/',
      })
    );
  });

  test('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'cancelOrder',
        orderId: '12345',
      };
      return params[param];
    });

    const mockResponse = { id: '12345', status: 'Cancelled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get open orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'getOpenOrders',
        pair: 'btcusd',
      };
      return params[param];
    });

    const mockResponse = [{ id: '12345', status: 'Open' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'createBuyOrder',
        pair: 'btcusd',
        amount: '0.001',
        price: '50000',
      };
      return params[param];
    });

    const apiError = new Error('Insufficient balance');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    await expect(
      executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Insufficient balance');
  });

  test('should handle continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      const params: any = {
        operation: 'createBuyOrder',
        pair: 'btcusd',
        amount: '0.001',
        price: '50000',
      };
      return params[param];
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    const apiError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        customerId: 'test-customer-id',
        secret: 'test-secret',
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

  describe('getBalance', () => {
    it('should get account balance successfully', async () => {
      const mockResponse = {
        usd_balance: '1000.00',
        btc_balance: '0.50000000',
        eth_balance: '10.00000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getBalance';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/balance/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: expect.objectContaining({
          key: 'test-api-key',
          signature: expect.any(String),
          nonce: expect.any(String),
        }),
      });
    });

    it('should handle balance request error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getBalance';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });

  describe('getPairBalance', () => {
    it('should get pair balance successfully', async () => {
      const mockResponse = {
        usd_balance: '500.00',
        btc_balance: '0.25000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getPairBalance';
        if (name === 'pair') return 'btcusd';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/balance/btcusd/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: expect.objectContaining({
          key: 'test-api-key',
        }),
      });
    });
  });

  describe('getUserTransactions', () => {
    it('should get user transactions successfully', async () => {
      const mockResponse = [
        {
          datetime: '2023-01-01 12:00:00',
          id: 12345,
          type: '0',
          usd: '-100.00',
          btc: '0.01000000',
        },
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number, defaultValue?: any) => {
        if (name === 'operation') return 'getUserTransactions';
        if (name === 'offset') return defaultValue || 0;
        if (name === 'limit') return defaultValue || 100;
        if (name === 'sort') return defaultValue || 'desc';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/user_transactions/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: expect.objectContaining({
          key: 'test-api-key',
          offset: '0',
          limit: '100',
          sort: 'desc',
        }),
      });
    });
  });

  describe('getTradingFees', () => {
    it('should get trading fees successfully', async () => {
      const mockResponse = {
        maker_fee: '0.005',
        taker_fee: '0.005',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getTradingFees';
        if (name === 'pair') return 'btcusd';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/trading-fees/btcusd/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: expect.objectContaining({
          key: 'test-api-key',
        }),
      });
    });
  });
});

describe('Withdrawals Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        customerId: 'test-customer-id',
        baseUrl: 'https://www.bitstamp.net/api/v2',
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

  it('should get withdrawal requests successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getWithdrawalRequests';
      if (param === 'timedelta') return 86400;
    });

    const mockResponse = [{ id: '123', status: 'completed', amount: '0.001' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/withdrawal-requests/',
      })
    );
  });

  it('should get open withdrawals successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getOpenWithdrawals';
    });

    const mockResponse = [{ id: '456', status: 'pending', amount: '0.002' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get withdrawal status successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getWithdrawalStatus';
      if (param === 'id') return '123';
    });

    const mockResponse = { id: '123', status: 'completed', amount: '0.001' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should cancel withdrawal successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'cancelWithdrawal';
      if (param === 'id') return '123';
    });

    const mockResponse = { id: '123', status: 'cancelled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should withdraw Bitcoin successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'withdrawBitcoin';
      if (param === 'amount') return '0.001';
      if (param === 'address') return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      if (param === 'instant') return false;
    });

    const mockResponse = { id: '789', status: 'processing' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should withdraw fiat successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'withdrawFiat';
      if (param === 'amount') return '1000';
      if (param === 'account_currency') return 'EUR';
      if (param === 'name') return 'John Doe';
      if (param === 'iban') return 'DE89370400440532013000';
      if (param === 'bic') return 'DEUTDEFF';
    });

    const mockResponse = { id: '999', status: 'processing' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getWithdrawalRequests';
      if (param === 'timedelta') return 86400;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Deposits Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
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

  test('should get Bitcoin address successfully', async () => {
    const mockResponse = {
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBitcoinAddress';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeDepositsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/btc_address/',
      })
    );
  });

  test('should transfer to main account successfully', async () => {
    const mockResponse = {
      id: '123456789',
      datetime: '2023-01-01 12:00:00',
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'transferToMain';
      if (param === 'amount') return '100.00';
      if (param === 'currency') return 'USD';
      if (param === 'subaccount') return 'sub123';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeDepositsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/transfer-to-main/',
      })
    );
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBitcoinAddress';
      return '';
    });
    
    const apiError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    
    const result = await executeDepositsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
  
  test('should get Ethereum address successfully', async () => {
    const mockResponse = {
      address: '0x742d35cc6648c532c5c2b4c0a3c9d7d7f5d5c5e5',
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getEthereumAddress';
      return '';
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeDepositsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://www.bitstamp.net/api/v2/eth_address/',
      })
    );
  });
});
});
