import { IncomingMessage, ServerResponse } from 'http';
import MovieService from '../../../../movies-management/services';
import SharedHelper from '../../../../shared/helpers';
import { handleGetMoviesByGenre } from '../../../../movies-management/routes/v1/movies-by-genre';

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

describe('Movies By Genre Route Handler', () => {
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;
  let mockUrl: URL;

  const setupMocks = () => {
    mockRequest = {};
    mockResponse = {} as Partial<ServerResponse>;
    mockUrl = new URL('http://localhost:3000/api/v1/movies/genre/Action');
  };

  beforeEach(() => {
    setupMocks();
    jest.clearAllMocks();
  });

  const mockMoviesResponse: PaginatedResponse = {
    data: [
      {
        movieId: 1,
        title: 'Test Action Movie 1',
        overview: 'Test Overview 1',
        releaseDate: '2024-03-15',
        genres: ['Action', 'Drama'],
        budget: '1000000',
        imdbId: 'tt1234567'
      },
      {
        movieId: 2,
        title: 'Test Action Movie 2',
        overview: 'Test Overview 2',
        releaseDate: '2024-03-16',
        genres: ['Action', 'Thriller'],
        budget: '2000000',
        imdbId: 'tt7654321'
      }
    ],
    page: 1,
    total_pages: 5,
    total_items: 50
  };

  describe('handleGetMoviesByGenre', () => {
    it('should return movies for specific genre with default pagination', async () => {
      jest.spyOn(MovieService, 'getMoviesByGenre').mockResolvedValueOnce(mockMoviesResponse);

      await handleGetMoviesByGenre(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockUrl,
        'Action'
      );

      expect(MovieService.getMoviesByGenre).toHaveBeenCalledWith('Action', 1);
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(mockResponse, mockMoviesResponse);
    });

    it('should return movies for specific genre with specified page', async () => {
      const page2Response = { ...mockMoviesResponse, page: 2 };
      mockUrl.searchParams.set('page', '2');
      jest.spyOn(MovieService, 'getMoviesByGenre').mockResolvedValueOnce(page2Response);

      await handleGetMoviesByGenre(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockUrl,
        'Action'
      );

      expect(MovieService.getMoviesByGenre).toHaveBeenCalledWith('Action', 2);
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(mockResponse, page2Response);
    });
  });
});
