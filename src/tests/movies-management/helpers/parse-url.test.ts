import { URL } from 'url';
import { parseUrl } from '../../../movies-management/helpers/parse-url';
import type { RouteConfig } from '../../../movies-management/helpers/create-route-config';

describe('parseUrl', () => {
  const mockHandler = jest.fn();
  const mockParseParams = jest.fn();

  const testRoutes: RouteConfig[] = [
    {
      pattern: /^\/movies$/,
      handler: mockHandler,
      parseParams: mockParseParams
    },
    {
      pattern: /^\/movies\/\d+$/,
      handler: mockHandler,
      parseParams: mockParseParams
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null for unmatched routes', () => {
    const url = new URL('http://localhost:3000/invalid');
    const result = parseUrl(url, testRoutes);
    expect(result).toBeNull();
  });

  it('should match exact routes', () => {
    const url = new URL('http://localhost:3000/movies');
    const expectedParams = { id: '123' };
    mockParseParams.mockReturnValue(expectedParams);

    const result = parseUrl(url, testRoutes);

    expect(result).toEqual({
      handler: mockHandler,
      params: expectedParams
    });
    expect(mockParseParams).toHaveBeenCalledWith(['movies'], url);
  });

  it('should match parameterized routes', () => {
    const url = new URL('http://localhost:3000/movies/123');
    const expectedParams = { id: '123' };
    mockParseParams.mockReturnValue(expectedParams);

    const result = parseUrl(url, testRoutes);

    expect(result).toEqual({
      handler: mockHandler,
      params: expectedParams
    });
    expect(mockParseParams).toHaveBeenCalledWith(['movies', '123'], url);
  });
});
