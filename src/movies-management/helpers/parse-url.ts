import { URL } from 'url';
import type { RouteConfig, RouteHandler, RouteParams } from './create-route-config';

export const parseUrl = (
  url: URL,
  configs: RouteConfig[]
): { handler: RouteHandler; params: RouteParams } | null => {
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  const matchedRoute = configs.find(config =>
    config.pattern.test(url.pathname)
  );

  if (!matchedRoute) return null;

  return {
    handler: matchedRoute.handler,
    params: matchedRoute.parseParams(pathParts, url),
  };
};
