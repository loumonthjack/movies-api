import Database from '../models';
import Helper from '../helpers';
import MoviesManagement from '../../movies-management';

export const getRatingFromDatabase = async (imdbId: string) => {
  try {
    const movieId = await MoviesManagement.Service.getMovieIdByImdbId(imdbId);
    if (!movieId) return null;
    const ratings = await Database.getRatingsByMovieId(movieId);
    if (!ratings.length) return null;

    return {
      source: 'Movie Management',
      value: Helper.calculateAverageRating(ratings)
    };
  } catch (error) {
    console.error('Error fetching rating from database:', error);
    return null;
  }
};
