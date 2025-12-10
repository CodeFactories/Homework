import Database from 'better-sqlite3';

const db = new Database('./db/app.db');

export default db;