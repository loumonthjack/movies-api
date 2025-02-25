import http from 'http';
import { URL } from 'url';
import MovieManagement from './movies-management';
import { SUPPORTED_VERSIONS, SupportedVersion } from './shared/supported-versions';
import { SUPPORTED_ROUTES, SupportedRoute } from './shared/supported-routes';
import SharedHelper from './shared/helpers';

const handleRequest = async (request: http.IncomingMessage, response: http.ServerResponse) => {
  try {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      SharedHelper.sendJson(response, { error: 'Not Found' }, 404);
      return;
    }

    const [firstPart] = pathParts;

    if (firstPart === 'heartbeat' && request.method === 'GET') {
      SharedHelper.sendJson(response, { status: 'ok' }, 200);
      return;
    }

    if (!SUPPORTED_VERSIONS.includes(firstPart as SupportedVersion)) {
      SharedHelper.sendJson(response, { error: 'Invalid API version', supportedVersions: SUPPORTED_VERSIONS }, 400);
      return;
    }

    const [,serviceType] = pathParts;
    if (!SUPPORTED_ROUTES.includes(serviceType as SupportedRoute)) {
      SharedHelper.sendJson(response, { error: 'Route not found', supportedRoutes: SUPPORTED_ROUTES }, 404);
      return;
    }

    const routes = {
      movies: MovieManagement.Api,
    };

    const route = routes[serviceType as keyof typeof routes];

    if (!route) {
      SharedHelper.sendJson(response, { error: 'Route not found', supportedRoutes: SUPPORTED_ROUTES }, 404);
      return;
    }

    await route.handleRequest(request, response);
  } catch (error) {
    console.error(error);
    SharedHelper.sendJson(response, { error: 'Internal Server Error' }, 500);
  }
};

export default handleRequest;
