import MoviesDbClient from "../db.client";

type MovieRow = {
  imdbId: string;
  title: string;
  genres: string;
  releaseDate: string;
  budget: number;
}

type CountRow = {
  count: string
}

type MovieDetailsRow = {
  imdbId: string;
  title: string;
  genres: string;
  releaseDate: string;
  budget: number;
  movieId: number;
  overview: string;
  productionCompanies: string;
  revenue: number;
  language: string;
  runtime: number;
  status: string;
}

const queryMovies = async <T>( sql: string, params: (string | number)[] = []): Promise<T[]> => {
  return await new Promise((resolve, reject) => {
    MoviesDbClient.connection.all(sql, params, (error: Error, rows: T[]) => {
      if (error) reject(error);
      resolve(rows);
    });
  });
};

export const getMovieIdByImdbId = async (imdbId: string) => {
  const result = await queryMovies<{ movieId: number }>('SELECT movieId FROM movies WHERE imdbId = ?', [imdbId]);
  return result.length > 0 ? result[0].movieId : null;
};

export const getMovieDetailsByImdbId = async (imdbId: string) => {
  const result = await queryMovies<MovieDetailsRow>(`
    SELECT * FROM movies WHERE imdbId = ?
  `, [imdbId]);
  return result.length > 0 ? result[0] : null;
};

export const getMoviesByGenre = async (genre: string, itemsPerPage: number, offset: number) => {
  return await Promise.all([
    queryMovies<MovieRow>(`
      SELECT imdbId, title, genres, releaseDate, budget 
      FROM movies 
      WHERE genres LIKE ?
      LIMIT ? OFFSET ?
    `, [`%${genre}%`, itemsPerPage, offset]),
    queryMovies<CountRow>('SELECT COUNT(*) as count FROM movies WHERE genres LIKE ?', [`%${genre}%`])
  ]);
};

export const getMoviesByYear = async (year: number, itemsPerPage: number, offset: number, sortDesc = false) => {
  return await Promise.all([
    queryMovies<MovieRow>(`
      SELECT imdbId, title, genres, releaseDate, budget 
      FROM movies
      WHERE strftime('%Y', releaseDate) = ?
      ORDER BY releaseDate ${sortDesc ? 'DESC' : 'ASC'}
      LIMIT ? OFFSET ?
    `, [year.toString(), itemsPerPage, offset]),
    queryMovies<CountRow>('SELECT COUNT(*) as count FROM movies WHERE strftime("%Y", releaseDate) = ?', [year.toString()])
  ]);
};

export const getMovies = async (itemsPerPage: number, offset: number) => {
  return await Promise.all([
    queryMovies<MovieRow>(`
      SELECT imdbId, title, genres, releaseDate, budget 
      FROM movies 
      LIMIT ? OFFSET ?
  `, [itemsPerPage, offset]),
    queryMovies<CountRow>('SELECT COUNT(*) as count FROM movies')
  ]);
};



