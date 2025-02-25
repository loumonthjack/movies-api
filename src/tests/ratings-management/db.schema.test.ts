import DB from '../../ratings-management/db.client';
import SharedHelper from '../../shared/helpers';
import dbSchema from '../../ratings-management/db.schema';

jest.mock('../../ratings-management/db.client');
jest.mock('../../shared/helpers');

describe('Ratings DB Schema', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully fetch ratings schema', async () => {
        const mockSchema = [{ sql: 'CREATE TABLE ratings (id INTEGER PRIMARY KEY)' }];
        (SharedHelper.getSchema as jest.Mock).mockResolvedValueOnce(mockSchema);

        const result = await dbSchema.getSchema();

        expect(SharedHelper.getSchema).toHaveBeenCalledWith(DB.connection, 'ratings');
        expect(result).toEqual(mockSchema);
    });

    it('should handle and throw errors when fetching schema fails', async () => {
        const mockError = new Error('Database error');
        (SharedHelper.getSchema as jest.Mock).mockRejectedValueOnce(mockError);

        await expect(dbSchema.getSchema()).rejects.toThrow('Database error');
        expect(SharedHelper.getSchema).toHaveBeenCalledWith(DB.connection, 'ratings');
    });
});
