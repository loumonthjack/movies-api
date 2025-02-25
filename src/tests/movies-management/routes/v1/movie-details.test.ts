import { IncomingMessage, ServerResponse } from 'http';
import MovieService from '../../../../movies-management/services';
import Ratings from '../../../../ratings-management';
import SharedHelper from '../../../../shared/helpers';
import { handleGetMovieDetails } from '../../../../movies-management/routes/v1/movie-details';

type MovieType = {
  genres: string[];
  productionCompanies: string[];
  budget: string;
  revenue: string;
  language: string;
  releaseDate: string | null;
  runtime: number;
  imdbId: string;
  title: string;
  movieId: number;
  overview: string;
  status: string;
}

interface RatingType {
  source: string;
  value: string;
}

jest.mock('../../../../movies-management/services');
jest.mock('../../../../ratings-management');
jest.mock('../../../../shared/helpers');

describe('Movie Details Route Handler', () => {
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;

  const setupMocks = () => {
    mockRequest = {};
    mockResponse = {} as Partial<ServerResponse>;
  };

  beforeEach(() => {
    setupMocks();
    jest.clearAllMocks();
  });

  const mockMovie: MovieType = {
    imdbId: 'tt1234567',
    title: 'Test Movie',
    movieId: 1,
    overview: 'A test movie description',
    status: 'Released',
    genres: [],
    productionCompanies: [],
    budget: '1000000',
    revenue: '5000000',
    language: 'en',
    releaseDate: '2024-03-15',
    runtime: 120
  };

  const mockRatings: RatingType[] = [
    { source: 'IMDb', value: '8.5' },
    { source: 'Rotten Tomatoes', value: '90%' },
  ];

  describe('handleGetMovieDetails', () => {
    it('should return movie details with ratings when movie exists', async () => {
      jest.spyOn(MovieService, 'getMovieByImdbId').mockResolvedValueOnce(mockMovie);
      jest.spyOn(Ratings.Service, 'getAllRatings').mockResolvedValueOnce(mockRatings);

      await handleGetMovieDetails(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        'tt1234567'
      );

      expect(MovieService.getMovieByImdbId).toHaveBeenCalledWith('tt1234567');
      expect(Ratings.Service.getAllRatings).toHaveBeenCalledWith('tt1234567');
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(
        mockResponse,
        { ...mockMovie, ratings: mockRatings }
      );
    });

    it('should return 404 when movie is not found', async () => {
      jest.spyOn(MovieService, 'getMovieByImdbId').mockResolvedValueOnce(null);

      await handleGetMovieDetails(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        'tt1234567'
      );

      expect(MovieService.getMovieByImdbId).toHaveBeenCalledWith('tt1234567');
      expect(Ratings.Service.getAllRatings).not.toHaveBeenCalled();
      expect(SharedHelper.sendJson).toHaveBeenCalledWith(
        mockResponse,
        { error: 'Movie not found' },
        404
      );
    });
  });
});
