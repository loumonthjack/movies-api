import { IncomingMessage, ServerResponse } from 'http';
import MovieService from '../../../../movies-management/services';
import SharedHelper from '../../../../shared/helpers';
import { handleGetAllMovies } from '../../../../movies-management/routes/v1/movies';

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

describe('Movies Route Handler', () => {
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;
  let mockUrl: URL;

  const setupMocks = () => {
    mockRequest = {};
    mockResponse = {} as Partial<ServerResponse>;
    mockUrl = new URL('http://localhost:3000/api/v1/movies');
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

  describe('handleGetAllMovies', () => {
    it('should return all movies with default pagination (page 1)', async () => {
      jest.spyOn(MovieService, 'getAllMovies').mockResolvedValueOnce(mockMoviesResponse);

      await handleGetAllMovies(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockUrl
      );

      expect(MovieService.getAllMovies).toHaveBeenCalledWith(1);
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(mockResponse, mockMoviesResponse);
    });

    it('should return movies for specified page', async () => {
      const page2Response = { ...mockMoviesResponse, page: 2 };
      mockUrl.searchParams.set('page', '2');
      jest.spyOn(MovieService, 'getAllMovies').mockResolvedValueOnce(page2Response);

      await handleGetAllMovies(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockUrl
      );

      expect(MovieService.getAllMovies).toHaveBeenCalledWith(2);
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(mockResponse, page2Response);
    });
  });
});
