import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import Route from './routes';
import Helper from './helpers';
import SharedHelper from '../shared/helpers';
import type { RouteConfig } from './helpers/create-route-config';
import { SUPPORTED_VERSIONS, isValidVersion } from '../shared/supported-versions';

const routeConfigs: RouteConfig[] = [
  Helper.createRouteConfig(
    /^\/v1\/movies$/,
    Route.handleGetAllMovies,
    (parts, url) => [url]
  ),
  Helper.createRouteConfig(
    /^\/v1\/movies\/tt\w+$/,
    Route.handleGetMovieDetails,
    (parts) => [parts[2]]
  ),
  Helper.createRouteConfig(
    /^\/v1\/movies\/year\/\d+$/,
    Route.handleGetMoviesByYear,
    (parts, url) => [url, parseInt(parts[3])]
  ),
  Helper.createRouteConfig(
    /^\/v1\/movies\/genre\/[^/]+$/,
    Route.handleGetMoviesByGenre,
    (parts, url) => [url, decodeURIComponent(parts[3])]
  ),
];

const handleMoviesRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  try {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const [version] = pathParts;

    if (!version || !isValidVersion(version)) {
      SharedHelper.sendJson(response, { 
        error: 'Invalid API version',
        supportedVersions: SUPPORTED_VERSIONS 
      }, 400);
      return;
    }
    
    if (request.method !== 'GET') {
      SharedHelper.sendJson(response, { error: 'Method not allowed' }, 405);
      return;
    }

    const route = Helper.parseUrl(url, routeConfigs);
    if (!route) {
      SharedHelper.sendJson(response, { error: 'Not Found' }, 404);
      return;
    }

    await route.handler(request, response, ...route.params);
  } catch (error) {
    console.error('Error handling movie request:', error);
    SharedHelper.sendJson(response, { error: 'Internal Server Error' }, 500);
  }
};

export default {
  handleRequest: handleMoviesRequest,
}
