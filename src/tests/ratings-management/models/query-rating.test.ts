import RatingsDbClient from "../../../ratings-management/db.client";
import { getRatingsByMovieId } from "../../../ratings-management/models/query-ratings";

jest.mock("../../../ratings-management/db.client", () => ({
    connection: {
        all: jest.fn()
    }
}));

describe("Ratings Query Functions", () => {
    const mockDbAll = RatingsDbClient.connection.all as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getRatingsByMovieId", () => {
        it("should return ratings for a valid movie id", async () => {
            const mockRatings = [
                { rating: 4 },
                { rating: 5 },
                { rating: 3 }
            ];

            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockRatings);
            });

            const result = await getRatingsByMovieId(1);

            expect(result).toEqual(mockRatings);
            expect(mockDbAll).toHaveBeenCalledWith(
                'SELECT rating FROM ratings WHERE movieId = ?',
                [1],
                expect.any(Function)
            );
        });

        it("should handle empty results", async () => {
            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(null, []);
            });

            const result = await getRatingsByMovieId(999);

            expect(result).toEqual([]);
            expect(mockDbAll).toHaveBeenCalledWith(
                'SELECT rating FROM ratings WHERE movieId = ?',
                [999],
                expect.any(Function)
            );
        });

        it("should reject with error when database fails", async () => {
            const dbError = new Error("Database error");
            
            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(dbError);
            });

            await expect(getRatingsByMovieId(1)).rejects.toThrow("Database error");
        });
    });
});
