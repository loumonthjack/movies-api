import { getMoviesByYear } from '../../../movies-management/services/get-movie-by-year';
import Database from '../../../movies-management/models';
import Helper from '../../../movies-management/helpers';

jest.mock('../../../movies-management/models');
jest.mock('../../../movies-management/helpers');

describe('Movies By Year Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      genres: '["Action"]',
      budget: 1_000_000
    },
    {
      id: 2,
      title: 'Test Movie 2',
      genres: '["Drama"]',
      budget: 2_000_000
    }
  ];

  const mockCount = [{ count: '2' }];

  it('should return paginated movies for a specific year', async () => {
    (Database.getMoviesByYear as jest.Mock).mockResolvedValue([mockMovies, mockCount]);
    (Helper.safeJsonParse as jest.Mock).mockImplementation((value) => JSON.parse(value));
    (Helper.formatBudgetToDollars as jest.Mock).mockImplementation((amount) => `$${amount}`);

    const result = await getMoviesByYear(2024, 1);

    expect(result).toEqual({
      data: mockMovies.map(movie => ({
        ...movie,
        genres: Helper.safeJsonParse(movie.genres),
        budget: `$${movie.budget}`
      })),
      page: 1,
      total_pages: 1,
      total_items: 2
    });
  });

  it('should handle sorting in descending order', async () => {
    (Database.getMoviesByYear as jest.Mock).mockResolvedValue([mockMovies, mockCount]);
    (Helper.formatBudgetToDollars as jest.Mock).mockImplementation((amount) => `$${amount}`);

    await getMoviesByYear(2024, 1, true);

    expect(Database.getMoviesByYear).toHaveBeenCalledWith(2024, 50, 0, true);
  });
});
