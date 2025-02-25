import { IncomingMessage, ServerResponse } from 'http';
import MovieService from '../../services';
import Rating from '../../../ratings-management';
import SharedHelper from '../../../shared/helpers';
import type { RouteHandler } from '../../helpers/create-route-config';

export const handleGetMovieDetails: RouteHandler = async (request: IncomingMessage, response: ServerResponse, ...params) => {
    const [imdbId] = params as [string];
    const movie = await MovieService.getMovieByImdbId(imdbId);
    if (!movie) {
      SharedHelper.sendJson(response, { error: 'Movie not found' }, 404);
      return;
    }

    const ratings = await Rating.Service.getAllRatings(imdbId);
    SharedHelper.sendJson(response, { ...movie, ratings });
};
