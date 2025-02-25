import Database from "../models";
import Helper from "../helpers";

export const getMovieByImdbId = async (imdbId: string) => {
    const movie = await Database.getMovieDetailsByImdbId(imdbId);
    if (!movie) return null;

    return {
      ...movie,
      genres: Helper.safeJsonParse(movie.genres),
      productionCompanies: Helper.safeJsonParse(movie.productionCompanies),
      budget: Helper.formatBudgetToDollars(movie.budget),
      revenue: Helper.formatBudgetToDollars(movie.revenue),
      language: movie.language || 'en',
      releaseDate: movie.releaseDate || null,
      runtime: movie.runtime || 0,
    };
};

export const getMovieIdByImdbId= async (imdbId: string) => {
  return await Database.getMovieIdByImdbId(imdbId);
}
    

