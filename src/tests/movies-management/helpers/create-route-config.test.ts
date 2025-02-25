import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { createRouteConfig, RouteHandler, RouteParams } from '../../../movies-management/helpers/create-route-config';

describe('createRouteConfig', () => {
  const mockHandler: RouteHandler = async (
    _req: IncomingMessage,
    _res: ServerResponse,
    ..._params: RouteParams
  ) => {
    return Promise.resolve();
  };

  const mockParseParams = (pathParts: string[], _url: URL): RouteParams => {
    return [pathParts[1]];
  };

  it('should create a valid route configuration', () => {
    const pattern = /^\/movies\/(\d+)$/;

    const result = createRouteConfig(pattern, mockHandler, mockParseParams);

    expect(result).toEqual({
      pattern,
      handler: mockHandler,
      parseParams: mockParseParams,
    });
  });

  it('should maintain the correct structure of RouteConfig', () => {
    const pattern = /^\/api\/v1\/(\w+)$/;

    const result = createRouteConfig(pattern, mockHandler, mockParseParams);

    expect(result).toHaveProperty('pattern');
    expect(result).toHaveProperty('handler');
    expect(result).toHaveProperty('parseParams');
    expect(result.pattern).toBeInstanceOf(RegExp);
    expect(typeof result.handler).toBe('function');
    expect(typeof result.parseParams).toBe('function');
  });

  it('should create unique configurations for different patterns', () => {
    const pattern1 = /^\/movies\/(\d+)$/;
    const pattern2 = /^\/ratings\/(\d+)$/;

    const config1 = createRouteConfig(pattern1, mockHandler, mockParseParams);
    const config2 = createRouteConfig(pattern2, mockHandler, mockParseParams);

    expect(config1.pattern).not.toEqual(config2.pattern);
    expect(config1).not.toEqual(config2);
  });
});
