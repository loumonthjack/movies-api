import sqlite3 from 'sqlite3';
import { getSchema, SchemaResult } from '../../../shared/helpers/get-schema';

jest.mock('sqlite3', () => ({
    Database: jest.fn()
}));

describe('getSchema', () => {
    let mockDb: jest.Mocked<sqlite3.Database>;
    
    beforeEach(() => {
        mockDb = {
            all: jest.fn()
        } as unknown as jest.Mocked<sqlite3.Database>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch schema successfully', async () => {
        const mockSchema: SchemaResult[] = [{
            sql: 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)'
        }];

        (mockDb.all as jest.Mock).mockImplementation(
            (_query: string, _params: any[], callback: (err: Error | null, rows?: SchemaResult[]) => void) => {
                callback(null, mockSchema);
                return mockDb;
            }
        );

        const result = await getSchema(mockDb, 'test');
        
        expect(result).toEqual(mockSchema);
        expect(mockDb.all).toHaveBeenCalledWith(
            'SELECT sql FROM sqlite_master WHERE type = ? AND name = ?',
            ['table', 'test'],
            expect.any(Function)
        );
    });

    it('should handle database errors', async () => {
        const mockError = new Error('Database error');
        
        (mockDb.all as jest.Mock).mockImplementation(
            (_query: string, _params: any[], callback: (err: Error | null, rows?: SchemaResult[]) => void) => {
                callback(mockError);
                return mockDb;
            }
        );

        await expect(getSchema(mockDb, 'test'))
            .rejects
            .toThrow('Database error');
    });

    it('should handle empty results', async () => {
        (mockDb.all as jest.Mock).mockImplementation(
            (_query: string, _params: any[], callback: (err: Error | null, rows?: SchemaResult[]) => void) => {
                callback(null, []);
                return mockDb;
            }
        );

        const result = await getSchema(mockDb, 'nonexistent_table');
        expect(result).toEqual([]);
    });
});
