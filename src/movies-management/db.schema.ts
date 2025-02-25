import SharedHelper from "../shared/helpers";
import DB from './db.client'

const getMovieSchema = async () => {
    try {
        return SharedHelper.getSchema(DB.connection, 'movies');
    } catch (error) {
        console.error('Error fetching movie schema:', error);
        throw error;
    }
};

export default {
    getSchema: getMovieSchema
}
