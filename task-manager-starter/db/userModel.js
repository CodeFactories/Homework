import db from './db.js';

export function getAllUsers() {
    return db.prepare('SELECT * FROM users').all();
}

export function addUser(name, email) {
    return db.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
    ).run(name, email);
}

export function deleteUser(id) {
  return db.prepare('DELETE FROM users WHERE id = ?').run(id);
}