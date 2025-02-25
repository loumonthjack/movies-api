import * as getAllMovies from './v1/movies';
import * as getMovieDetails from './v1/movie-details';
import * as getMoviesByYear from './v1/movies-by-year';
import * as getMoviesByGenre from './v1/movies-by-genre';

export default {
    ...getAllMovies,
    ...getMovieDetails,
    ...getMoviesByYear,
    ...getMoviesByGenre
};
