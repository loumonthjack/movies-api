import { IncomingMessage, ServerResponse } from "http";
import MovieService from "../../services";
import SharedHelper from '../../../shared/helpers';
import type { RouteHandler } from '../../helpers/create-route-config';

export const handleGetMoviesByGenre: RouteHandler = async (request: IncomingMessage, response: ServerResponse, ...params) => {
    const [url, genre] = params as [URL, string];
    const page = parseInt(url.searchParams.get('page') || '1');
    const movies = await MovieService.getMoviesByGenre(genre, page);
    SharedHelper.sendJson(response, movies);
};
