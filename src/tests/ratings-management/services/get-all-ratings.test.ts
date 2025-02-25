import { getAllRatings } from '../../../ratings-management/services/get-all-ratings';
import { getRatingFromDatabase } from '../../../ratings-management/services/get-ratings';
import OmdbService from '../../../ratings-management/services/external/omdb';

jest.mock('../../../ratings-management/services/get-ratings');
jest.mock('../../../ratings-management/services/external/omdb');

describe('getAllRatings', () => {
    const mockImdbId = 'tt1234567';
    const mockLocalRating = {
        source: 'Movie Management',
        value: '4.5'
    };
    const mockOmdbRating = {
        source: 'Rotten Tomatoes',
        value: '85%'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return both ratings when available', async () => {
        (getRatingFromDatabase as jest.Mock).mockResolvedValue(mockLocalRating);
        (OmdbService.getRottenTomatoesRating as jest.Mock).mockResolvedValue(mockOmdbRating);

        const result = await getAllRatings(mockImdbId);

        expect(getRatingFromDatabase).toHaveBeenCalledWith(mockImdbId);
        expect(OmdbService.getRottenTomatoesRating).toHaveBeenCalledWith(mockImdbId);
        expect(result).toEqual([mockLocalRating, mockOmdbRating]);
    });

    it('should return only local rating when OMDB rating is not available', async () => {
        (getRatingFromDatabase as jest.Mock).mockResolvedValue(mockLocalRating);
        (OmdbService.getRottenTomatoesRating as jest.Mock).mockResolvedValue(null);

        const result = await getAllRatings(mockImdbId);

        expect(getRatingFromDatabase).toHaveBeenCalledWith(mockImdbId);
        expect(OmdbService.getRottenTomatoesRating).toHaveBeenCalledWith(mockImdbId);
        expect(result).toEqual([mockLocalRating]);
    });

    it('should return only OMDB rating when local rating is not available', async () => {
        (getRatingFromDatabase as jest.Mock).mockResolvedValue(null);
        (OmdbService.getRottenTomatoesRating as jest.Mock).mockResolvedValue(mockOmdbRating);

        const result = await getAllRatings(mockImdbId);

        expect(getRatingFromDatabase).toHaveBeenCalledWith(mockImdbId);
        expect(OmdbService.getRottenTomatoesRating).toHaveBeenCalledWith(mockImdbId);
        expect(result).toEqual([mockOmdbRating]);
    });

    it('should return empty array when no ratings are available', async () => {
        (getRatingFromDatabase as jest.Mock).mockResolvedValue(null);
        (OmdbService.getRottenTomatoesRating as jest.Mock).mockResolvedValue(null);

        const result = await getAllRatings(mockImdbId);

        expect(getRatingFromDatabase).toHaveBeenCalledWith(mockImdbId);
        expect(OmdbService.getRottenTomatoesRating).toHaveBeenCalledWith(mockImdbId);
        expect(result).toEqual([]);
    });
});
