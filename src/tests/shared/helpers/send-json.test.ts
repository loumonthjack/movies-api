import { ServerResponse } from 'http';
import { sendJson } from '../../../shared/helpers/send-json';

describe('sendJson', () => {
  let mockResponse: Partial<ServerResponse>;
  
  beforeEach(() => {
    mockResponse = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
  });

  it('should send JSON response with default status code', () => {
    const testData = { message: 'test' };
    
    sendJson(mockResponse as ServerResponse, testData);
    
    expect(mockResponse.writeHead).toHaveBeenCalledWith(
      200,
      { 'Content-Type': 'application/json' }
    );
    expect(mockResponse.end).toHaveBeenCalledWith(
      JSON.stringify(testData)
    );
  });

  it('should send JSON response with custom status code', () => {
    const testData = { error: 'Not Found' };
    const statusCode = 404;
    
    sendJson(mockResponse as ServerResponse, testData, statusCode);
    
    expect(mockResponse.writeHead).toHaveBeenCalledWith(
      statusCode,
      { 'Content-Type': 'application/json' }
    );
    expect(mockResponse.end).toHaveBeenCalledWith(
      JSON.stringify(testData)
    );
  });

  it('should handle null and undefined data', () => {
    sendJson(mockResponse as ServerResponse, null);
    
    expect(mockResponse.writeHead).toHaveBeenCalledWith(
      200,
      { 'Content-Type': 'application/json' }
    );
    expect(mockResponse.end).toHaveBeenCalledWith('null');
  });
});
