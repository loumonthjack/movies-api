import sqlite3 from 'sqlite3';

export type SchemaResult = {
    sql: string;
};

export const getSchema = async (connection: sqlite3.Database, tableName: string): Promise<SchemaResult[]> => {
    return new Promise((resolve, reject) => {
        connection.all(
            'SELECT sql FROM sqlite_master WHERE type = ? AND name = ?',
            ['table', tableName],
            (err, rows: SchemaResult[]) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

