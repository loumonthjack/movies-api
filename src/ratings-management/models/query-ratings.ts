import RatingsDbClient from "../db.client";

const queryRatings = async <T>(sql: string, params: (string | number)[] = []): Promise<T[]> => {
    return await new Promise((resolve, reject) => {
        RatingsDbClient.connection.all(sql, params, (error: Error, rows: T[]) => {
            if (error) reject(error);
            resolve(rows);
        });
    });

};

export const getRatingsByMovieId = async (movieId: number) => {
    return await queryRatings<{ rating: number }>('SELECT rating FROM ratings WHERE movieId = ?', [movieId]);
};
