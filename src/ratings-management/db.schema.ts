import SharedHelper from "../shared/helpers";
import DB from './db.client'

const getRatingsSchema = async () => {
    try {
        return SharedHelper.getSchema(DB.connection, 'ratings');
    } catch (error) {
        console.error('🚨 Error fetching ratings schema:', error);
        throw error;
    }
};

export default {
    getSchema: getRatingsSchema
}
