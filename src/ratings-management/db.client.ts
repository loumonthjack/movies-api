import sqlite3 from 'sqlite3';

const connection = new sqlite3.Database('./db/ratings.db');

export default {
  connection,
};
