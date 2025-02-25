import { getRatingFromDatabase } from '../../../ratings-management/services/get-ratings';
import Database from '../../../ratings-management/models';
import Helper from '../../../ratings-management/helpers';
import MoviesManagement from '../../../movies-management';

jest.mock('../../../ratings-management/models');
jest.mock('../../../ratings-management/helpers');
jest.mock('../../../movies-management');

describe('getRatingFromDatabase', () => {
    const mockImdbId = 'tt1234567';
    const mockMovieId = 1;
    const mockRatings = [4, 5, 3];
    const mockAverageRating = '4.0';

    beforeEach(() => {
        jest.clearAllMocks();
        (MoviesManagement.Services.getMovieIdByImdbId as jest.Mock).mockResolvedValue(mockMovieId);
        (Database.getRatingsByMovieId as jest.Mock).mockResolvedValue(mockRatings);
        (Helper.calculateAverageRating as jest.Mock).mockReturnValue(mockAverageRating);
    });

    it('should return rating when movie exists and has ratings', async () => {
        const result = await getRatingFromDatabase(mockImdbId);

        expect(MoviesManagement.Services.getMovieIdByImdbId).toHaveBeenCalledWith(mockImdbId);
        expect(Database.getRatingsByMovieId).toHaveBeenCalledWith(mockMovieId);
        expect(Helper.calculateAverageRating).toHaveBeenCalledWith(mockRatings);
        expect(result).toEqual({
            source: 'Movie Management',
            value: mockAverageRating
        });
    });

    it('should return null when movie is not found', async () => {
        (MoviesManagement.Services.getMovieIdByImdbId as jest.Mock).mockResolvedValue(null);

        const result = await getRatingFromDatabase(mockImdbId);

        expect(MoviesManagement.Services.getMovieIdByImdbId).toHaveBeenCalledWith(mockImdbId);
        expect(Database.getRatingsByMovieId).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('should return null when movie has no ratings', async () => {
        (Database.getRatingsByMovieId as jest.Mock).mockResolvedValue([]);

        const result = await getRatingFromDatabase(mockImdbId);

        expect(MoviesManagement.Services.getMovieIdByImdbId).toHaveBeenCalledWith(mockImdbId);
        expect(Database.getRatingsByMovieId).toHaveBeenCalledWith(mockMovieId);
        expect(result).toBeNull();
    });

    it('should return null when database query fails', async () => {
        (Database.getRatingsByMovieId as jest.Mock).mockRejectedValue(new Error('Database error'));

        const result = await getRatingFromDatabase(mockImdbId);

        expect(MoviesManagement.Services.getMovieIdByImdbId).toHaveBeenCalledWith(mockImdbId);
        expect(Database.getRatingsByMovieId).toHaveBeenCalledWith(mockMovieId);
        expect(result).toBeNull();
    });
});
