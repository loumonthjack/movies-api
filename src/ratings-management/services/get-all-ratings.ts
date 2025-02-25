import { getRatingFromDatabase } from './get-ratings';
import OmdbService from './external/omdb';

type Rating = {
    source: string;
    value: string;
};

export const getAllRatings = async (imdbId: string) => {
    const [localRating, omdbRating] = await Promise.all([
        getRatingFromDatabase(imdbId),
        OmdbService.getRottenTomatoesRating(imdbId)
    ]);

    return [localRating, omdbRating].filter((rating): rating is Rating => rating !== null);
};
