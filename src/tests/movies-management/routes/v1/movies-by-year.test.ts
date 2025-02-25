import { IncomingMessage, ServerResponse } from 'http';
import MovieService from '../../../../movies-management/services';
import SharedHelper from '../../../../shared/helpers';
import { handleGetMoviesByYear } from '../../../../movies-management/routes/v1/movies-by-year';

type MovieType = {
  movieId: number;
  title: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  budget: string;
  imdbId: string;
};

type PaginatedResponse = {
  data: MovieType[];
  page: number;
  total_pages: number;
  total_items: number;
};

jest.mock('../../../../movies-management/services');
jest.mock('../../../../shared/helpers');

describe('Movies By Year Route Handler', () => {
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;
  let mockUrl: URL;

  const setupMocks = () => {
    mockRequest = {};
    mockResponse = {} as Partial<ServerResponse>;
    mockUrl = new URL('http://localhost:3000/api/v1/movies/year/2024');
  };

  beforeEach(() => {
    setupMocks();
    jest.clearAllMocks();
  });

  const mockMoviesResponse: PaginatedResponse = {
    data: [
      {
        movieId: 1,
        title: 'Test Movie 1',
        overview: 'Test Overview 1',
        releaseDate: '2024-03-15',
        genres: ['Action', 'Drama'],
        budget: '1000000',
        imdbId: 'tt1234567'
      },
      {
        movieId: 2,
        title: 'Test Movie 2',
        overview: 'Test Overview 2',
        releaseDate: '2024-03-16',
        genres: ['Comedy'],
        budget: '2000000',
        imdbId: 'tt7654321'
      }
    ],
    page: 1,
    total_pages: 5,
    total_items: 50
  };

  describe('handleGetMoviesByYear', () => {
    it('should return movies for specific year with default pagination and sorting', async () => {
      jest.spyOn(MovieService, 'getMoviesByYear').mockResolvedValueOnce(mockMoviesResponse);

      await handleGetMoviesByYear(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockUrl,
        2024
      );

      expect(MovieService.getMoviesByYear).toHaveBeenCalledWith(2024, 1, false);
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(mockResponse, mockMoviesResponse);
    });

    it('should return movies with specified page and descending sort', async () => {
      const page2Response = { ...mockMoviesResponse, page: 2 };
      mockUrl.searchParams.set('page', '2');
      mockUrl.searchParams.set('sort', 'desc');
      jest.spyOn(MovieService, 'getMoviesByYear').mockResolvedValueOnce(page2Response);

      await handleGetMoviesByYear(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockUrl,
        2024
      );

      expect(MovieService.getMoviesByYear).toHaveBeenCalledWith(2024, 2, true);
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(mockResponse, page2Response);
    });
  });
});
