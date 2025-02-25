import env from "../../../env";

type OMDBRating = {
    Source: string;
    Value: string;
}

type OMDBResponse = {
    Ratings?: OMDBRating[];
    Response: string;
    Error?: string;
}

class OMDBClient {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async fetchData(imdbId: string): Promise<OMDBResponse | null> {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${this.apiKey}`);
            return response.ok ? await response.json() as OMDBResponse : null;
        } catch (error) {
            console.error('OMDB API error:', error);
            return null;
        }
    }

    async getRottenTomatoesRating(imdbId: string) {
        const data = await this.fetchData(imdbId);
        const rating = data?.Ratings?.find(rating => rating.Source === 'Rotten Tomatoes');
        return rating ? { source: rating.Source, value: rating.Value } : null;
    }
}

export default new OMDBClient(env.OMDB_API_KEY);
