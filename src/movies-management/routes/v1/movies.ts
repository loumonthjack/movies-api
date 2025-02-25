import { IncomingMessage, ServerResponse } from 'http';
import MovieService from '../../services';
import SharedHelper from '../../../shared/helpers';
import type { RouteHandler } from '../../helpers/create-route-config';

export const handleGetAllMovies: RouteHandler = async (request: IncomingMessage, response: ServerResponse, ...params) => {
    const [url] = params as [URL];
    const page = parseInt(url.searchParams.get('page') || '1');
    const movies = await MovieService.getAllMovies(page);
    SharedHelper.sendJson(response, movies);
};
