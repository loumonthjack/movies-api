
const mockFetch = jest.fn();
global.fetch = mockFetch;

import omdbService from '../../../../ratings-management/services/external/omdb';

describe('OMDB Service', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe('getRottenTomatoesRating', () => {
        const mockImdbId = 'tt1234567';
        const mockApiUrl = `https://www.omdbapi.com/?i=${mockImdbId}&apikey=${process.env.OMDB_API_KEY}`;
        type MockResponse = {
            Ratings: {
                Source: string;
                Value: string;
            }[];
        }
        const setupMockFetch = (response: MockResponse) => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => response
            });
        };

        it('should return Rotten Tomatoes rating when available', async () => {
            const mockResponse = {
                Ratings: [
                    { Source: 'Rotten Tomatoes', Value: '85%' },
                    { Source: 'IMDB', Value: '7.5/10' }
                ]
            };
            setupMockFetch(mockResponse);

            const result = await omdbService.getRottenTomatoesRating(mockImdbId);

            expect(mockFetch).toHaveBeenCalledWith(mockApiUrl);
            expect(result).toEqual({
                source: 'Rotten Tomatoes',
                value: '85%'
            });
        });

        it('should return null when Rotten Tomatoes rating is not available', async () => {
            const mockResponse = {
                Ratings: [
                    { Source: 'IMDB', Value: '7.5/10' }
                ]
            };
            setupMockFetch(mockResponse);

            const result = await omdbService.getRottenTomatoesRating(mockImdbId);

            expect(mockFetch).toHaveBeenCalledWith(mockApiUrl);
            expect(result).toBeNull();
        });

        it('should return null when API call fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('API Error'));

            const result = await omdbService.getRottenTomatoesRating(mockImdbId);

            expect(mockFetch).toHaveBeenCalledWith(mockApiUrl);
            expect(result).toBeNull();
        });

        it('should return null when response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false
            });

            const result = await omdbService.getRottenTomatoesRating(mockImdbId);

            expect(mockFetch).toHaveBeenCalledWith(mockApiUrl);
            expect(result).toBeNull();
        });
    });
});
