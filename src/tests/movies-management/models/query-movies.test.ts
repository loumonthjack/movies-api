import MoviesDbClient from "../../../movies-management/db.client";
import { 
    getMovieIdByImdbId, 
    getMovieDetailsByImdbId, 
    getMoviesByGenre, 
    getMoviesByYear, 
    getMovies 
} from "../../../movies-management/models/query-movies";

jest.mock("../../../movies-management/db.client", () => ({
    connection: {
        all: jest.fn()
    }
}));

describe("Movies Query Functions", () => {
    const mockDbAll = MoviesDbClient.connection.all as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getMovieIdByImdbId", () => {
        it("should return movieId for valid imdbId", async () => {
            const mockMovie = [{ movieId: 123 }];
            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockMovie);
            });

            const result = await getMovieIdByImdbId("tt1234567");
            
            expect(result).toBe(123);
            expect(mockDbAll).toHaveBeenCalledWith(
                'SELECT movieId FROM movies WHERE imdbId = ?',
                ["tt1234567"],
                expect.any(Function)
            );
        });

        it("should return null for non-existent imdbId", async () => {
            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(null, []);
            });

            const result = await getMovieIdByImdbId("invalid");
            
            expect(result).toBeNull();
        });
    });

    describe("getMovieDetailsByImdbId", () => {
        it("should return movie details for valid imdbId", async () => {
            const mockMovieDetails = [{
                imdbId: "tt1234567",
                title: "Test Movie",
                genres: "Action,Drama",
                releaseDate: "2023-01-01",
                budget: 1_000_000,
                movieId: 123,
                overview: "Test overview",
                productionCompanies: "Test Studio",
                revenue: 2_000_000,
                language: "en",
                runtime: 120,
                status: "Released"
            }];

            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockMovieDetails);
            });

            const result = await getMovieDetailsByImdbId("tt1234567");
            
            expect(result).toEqual(mockMovieDetails[0]);
        });

        it("should return null for non-existent imdbId", async () => {
            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(null, []);
            });

            const result = await getMovieDetailsByImdbId("invalid");
            
            expect(result).toBeNull();
        });
    });

    describe("getMoviesByGenre", () => {
        it("should return movies and count for valid genre", async () => {
            const mockMovies = [{
                imdbId: "tt1234567",
                title: "Test Movie",
                genres: "Action,Drama",
                releaseDate: "2023-01-01",
                budget: 1_000_000
            }];
            const mockCount = [{ count: "1" }];

            mockDbAll.mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockMovies);
            }).mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockCount);
            });

            const [movies, count] = await getMoviesByGenre("Action", 10, 0);
            
            expect(movies).toEqual(mockMovies);
            expect(count).toEqual(mockCount);
        });
    });

    describe("getMoviesByYear", () => {
        it("should return movies and count for valid year with default sorting", async () => {
            const mockMovies = [{
                imdbId: "tt1234567",
                title: "Test Movie",
                genres: "Action",
                releaseDate: "2023-01-01",
                budget: 1_000_000
            }];
            const mockCount = [{ count: "1" }];

            mockDbAll.mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockMovies);
            }).mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockCount);
            });

            const [movies, count] = await getMoviesByYear(2023, 10, 0);
            
            expect(movies).toEqual(mockMovies);
            expect(count).toEqual(mockCount);
        });

        it("should handle descending sort order", async () => {
            const mockMovies = [{
                imdbId: "tt1234567",
                title: "Test Movie",
                genres: "Action",
                releaseDate: "2023-12-31",
                budget: 1_000_000
            }];
            const mockCount = [{ count: "1" }];

            mockDbAll.mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockMovies);
            }).mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockCount);
            });

            const [movies, count] = await getMoviesByYear(2023, 10, 0, true);
            
            expect(movies).toEqual(mockMovies);
            expect(count).toEqual(mockCount);
        });
    });

    describe("getMovies", () => {
        it("should return paginated movies and total count", async () => {
            const mockMovies = [{
                imdbId: "tt1234567",
                title: "Test Movie",
                genres: "Action",
                releaseDate: "2023-01-01",
                budget: 1_000_000
            }];
            const mockCount = [{ count: "100" }];

            mockDbAll.mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockMovies);
            }).mockImplementationOnce((_sql: string, _params: any[], callback: Function) => {
                callback(null, mockCount);
            });

            const [movies, count] = await getMovies(10, 0);
            
            expect(movies).toEqual(mockMovies);
            expect(count).toEqual(mockCount);
        });

        it("should handle database errors", async () => {
            const dbError = new Error("Database error");
            
            mockDbAll.mockImplementation((_sql: string, _params: any[], callback: Function) => {
                callback(dbError);
            });

            await expect(getMovies(10, 0)).rejects.toThrow("Database error");
        });
    });
});
