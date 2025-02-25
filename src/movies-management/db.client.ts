import sqlite3 from 'sqlite3';

const connection = new sqlite3.Database('./db/movies.db');

export default {
    connection
};
