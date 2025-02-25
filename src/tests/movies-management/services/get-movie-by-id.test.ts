import { getMovieByImdbId, getMovieIdByImdbId } from '../../../movies-management/services/get-movie-by-id';
import Database from '../../../movies-management/models';
import Helper from '../../../movies-management/helpers';

jest.mock('../../../movies-management/models');
jest.mock('../../../movies-management/helpers');

describe('Movie ID Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovieByImdbId', () => {
    const mockMovie = {
      id: 1,
      title: 'Test Movie',
      genres: '["Action", "Drama"]',
      productionCompanies: '["Company1", "Company2"]',
      budget: 1_000_000,
      revenue: 2_000_000,
      language: 'en',
      releaseDate: '2024-01-01',
      runtime: 120
    };

    it('should return formatted movie when found', async () => {
      (Database.getMovieDetailsByImdbId as jest.Mock).mockResolvedValue(mockMovie);
      (Helper.safeJsonParse as jest.Mock).mockImplementation((data) => JSON.parse(data));
      (Helper.formatBudgetToDollars as jest.Mock).mockImplementation((amount) => `$${amount}`);

      const result = await getMovieByImdbId('tt1234567');

      expect(result).toEqual({
        ...mockMovie,
        genres: ['Action', 'Drama'],
        productionCompanies: ['Company1', 'Company2'],
        budget: '$1000000',
        revenue: '$2000000'
      });
    });

    it('should return null when movie not found', async () => {
      (Database.getMovieDetailsByImdbId as jest.Mock).mockResolvedValue(null);

      const result = await getMovieByImdbId('tt1234567');

      expect(result).toBeNull();
    });
  });

  describe('getMovieIdByImdbId', () => {
    it('should return movie id when found', async () => {
      (Database.getMovieIdByImdbId as jest.Mock).mockResolvedValue(1);

      const result = await getMovieIdByImdbId('tt1234567');

      expect(result).toBe(1);
    });
  });
});
