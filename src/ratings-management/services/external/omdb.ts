import env from '../../../env';

type OMDBRating = {
    Source: string;
    Value: string;
}

type OMDBResponse = {
    Ratings?: OMDBRating[];
    Response: string;
    Error?: string;
}

const fetchDataFromOMDB = async (imdbId: string) => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${env.OMDB_API_KEY}`);
        if (!response.ok) return null;
        return await response.json() as OMDBResponse;
    } catch (error) {
        console.error('Error fetching OMDB data:', error);
        return null;
    }
};

const getRottenTomatoesRating = async (imdbId: string) => {
    const data = await fetchDataFromOMDB(imdbId);
    if (!data) return null;

    const rottenTomatoesRating = data.Ratings?.find(rating => rating.Source === 'Rotten Tomatoes');
    return rottenTomatoesRating ? {
        source: rottenTomatoesRating.Source,
        value: rottenTomatoesRating.Value
    } : null;
};

export default {
    getRottenTomatoesRating
};

