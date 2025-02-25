import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import Api from '../../movies-management/api';
import Route from '../../movies-management/routes';
import Helper from '../../movies-management/helpers';
import SharedHelper from '../../shared/helpers';
jest.mock('../../movies-management/routes');
jest.mock('../../movies-management/helpers');
jest.mock('../../shared/helpers');

const mockRequest = (url: string, method = 'GET'): Partial<IncomingMessage> => ({
  url,
  method,
  headers: { host: 'localhost:3000' }
});

const mockResponse = (): Partial<ServerResponse> => ({
  writeHead: jest.fn(),
  end: jest.fn()
});

describe('API Request Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Version Validation', () => {
    it('should return 400 for invalid API version', async () => {
      const req = mockRequest('/v2/movies') as IncomingMessage;
      const res = mockResponse() as ServerResponse;

      await Api.handleRequest(req, res);

      expect(SharedHelper.sendJson).toHaveBeenCalledWith(
        res,
        { error: 'Invalid API version', supportedVersions: ['v1'] },
        400
      );
    });
  });

  describe('Method Validation', () => {
    it('should return 405 for non-GET methods', async () => {
      const req = mockRequest('/v1/movies', 'POST') as IncomingMessage;
      const res = mockResponse() as ServerResponse;

      await Api.handleRequest(req, res);

      expect(SharedHelper.sendJson).toHaveBeenCalledWith(
        res,
        { error: 'Method not allowed' },
        405
      );
    });
  });

  describe('Route Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const req = mockRequest('/v1/invalid') as IncomingMessage;
      const res = mockResponse() as ServerResponse;

      (Helper.parseUrl as jest.Mock).mockReturnValue(null);

      await Api.handleRequest(req, res);

      expect(SharedHelper.sendJson).toHaveBeenCalledWith(
        res,
        { error: 'Not Found' },
        404
      );
    });

    it('should handle valid routes successfully', async () => {
      const req = mockRequest('/v1/movies') as IncomingMessage;
      const res = mockResponse() as ServerResponse;
      const mockUrl = new URL(`${req.url}`, `http://${req.headers.host}`);

      const mockRoute = {
        handler: Route.handleGetAllMovies,
        params: [mockUrl]
      };

      (Helper.parseUrl as jest.Mock).mockReturnValue(mockRoute);

      await Api.handleRequest(req, res);

      expect(mockRoute.handler).toHaveBeenCalledWith(req, res, ...mockRoute.params);
    });
  });

  describe('Error Handling', () => {
    it('should handle internal server errors', async () => {
      const req = mockRequest('/v1/movies') as IncomingMessage;
      const res = mockResponse() as ServerResponse;

      const mockError = new Error('Test error');
      (Helper.parseUrl as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      await Api.handleRequest(req, res);

      expect(SharedHelper.sendJson).toHaveBeenCalledWith(
        res,
        { error: 'Internal Server Error' },
        500
      );
    });
  });
});
