import { ServerResponse, IncomingMessage } from "http";
import MovieService from "../../services";
import SharedHelper from '../../../shared/helpers';
import type { RouteHandler } from '../../helpers/create-route-config';

export const handleGetMoviesByYear: RouteHandler = async (request: IncomingMessage, response: ServerResponse, ...params) => {
    const [url, year] = params as [URL, number];
    const page = parseInt(url.searchParams.get('page') || '1');
    const sortDesc = url.searchParams.get('sort') === 'desc';
    const movies = await MovieService.getMoviesByYear(year, page, sortDesc);
    SharedHelper.sendJson(response, movies);
};
