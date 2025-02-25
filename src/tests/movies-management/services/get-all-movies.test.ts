import { getAllMovies } from '../../../movies-management/services/get-all-movies';
import Database from '../../../movies-management/models';
import Helper from '../../../movies-management/helpers';

jest.mock('../../../movies-management/models');
jest.mock('../../../movies-management/helpers');

describe('Get All Movies Service Tests', () => {
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

  it('should return paginated movies', async () => {
    (Database.getMovies as jest.Mock).mockResolvedValue([mockMovies, mockCount]);
    (Helper.safeJsonParse as jest.Mock).mockImplementation((value) => JSON.parse(value));
    (Helper.formatBudgetToDollars as jest.Mock).mockImplementation((amount) => `$${amount}`);

    const result = await getAllMovies(1);

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

    expect(Database.getMovies).toHaveBeenCalledWith(50, 0);
  });

  it('should handle pagination correctly', async () => {
    (Database.getMovies as jest.Mock).mockResolvedValue([mockMovies, mockCount]);
    (Helper.formatBudgetToDollars as jest.Mock).mockImplementation((amount) => `$${amount}`);

    await getAllMovies(2);

    expect(Database.getMovies).toHaveBeenCalledWith(50, 50);
  });
});
