import { IncomingMessage, ServerResponse } from 'http';
import MovieManagement from '../movies-management';
import handleRequest from '../request-handler';

jest.mock('../movies-management', () => ({
  Api: {
    handleRequest: jest.fn()
  }
}));

describe('Request Handler', () => {
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;

  const setupMocks = () => {
    mockRequest = {
      url: 'http://localhost:3001',
      headers: { host: 'localhost:3001' },
      method: 'GET'
    };
    mockResponse = {
      writeHead: jest.fn(),
      end: jest.fn()
    };
  };

  beforeEach(() => {
    setupMocks();
    jest.clearAllMocks();
  });

  describe('Heartbeat Endpoint', () => {
    it('should handle heartbeat endpoint correctly', async () => {
      mockRequest.url = 'http://localhost:3001/heartbeat';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        200,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({ status: 'ok' })
      );
    });
  });

  describe('API Version Validation', () => {
    it('should reject requests with invalid API version', async () => {
      mockRequest.url = 'http://localhost:3001/v2/movies';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        400,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({ 
          error: 'Invalid API version',
          supportedVersions: ['v1']
        })
      );
    });
    it('should reject requests with invalid Route', async () => {
      mockRequest.url = 'http://localhost:3001/v1/invalid-route';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        404,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({
            error: "Route not found",
            supportedRoutes: [
              "movies"
            ]
          })
      );
    });

    it('should accept requests with valid API version', async () => {
      mockRequest.url = 'http://localhost:3001/v1/movies';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(MovieManagement.Api.handleRequest).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });
  });

  describe('Service Routing', () => {
    it('should reject requests with invalid service type', async () => {
      mockRequest.url = 'http://localhost:3001/v1/invalid-service';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        404,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({ 
          error: 'Route not found',
          supportedRoutes: ['movies']
        })
      );
    });

    it('should route movies service requests to MovieManagement', async () => {
      mockRequest.url = 'http://localhost:3001/v1/movies';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(MovieManagement.Api.handleRequest).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle root path with 404', async () => {
      mockRequest.url = 'http://localhost:3001/';
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        404,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({ error: 'Not Found' })
      );
    });

    it('should handle invalid URLs gracefully', async () => {
      mockRequest.url = undefined;
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        404,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({ error: 'Not Found' })
      );
    });

    it('should handle internal errors with 500 status code', async () => {
      mockRequest.url = 'http://localhost:3001/v1/movies';
      const error = new Error('Test error');
      (MovieManagement.Api.handleRequest as jest.Mock).mockRejectedValueOnce(error);
      
      await handleRequest(mockRequest as IncomingMessage, mockResponse as ServerResponse);
      
      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        500,
        { 'Content-Type': 'application/json' }
      );
      expect(mockResponse.end).toHaveBeenCalledWith(
        JSON.stringify({ error: 'Internal Server Error' })
      );
    });
  });
});
