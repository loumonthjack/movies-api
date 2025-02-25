import * as getAllMovies from "./get-all-movies";
import * as getMovieById from "./get-movie-by-id";
import * as getMoviesByYear from "./get-movie-by-year";
import * as getMoviesByGenre from "./get-movie-by-genre";

export default {
    ...getAllMovies,
    ...getMovieById,
    ...getMoviesByYear,
    ...getMoviesByGenre,
};
