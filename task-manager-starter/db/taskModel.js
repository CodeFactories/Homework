import db from './db.js';

export function getTasksByUser(userId) {
  return db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(userId);
}

// TODO: Implement this function
export function addTask(userId, title) {
  const statement = db.prepare('INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, ?)');
  return statement.run(userId, title, 0); // 0 for "completed: false" initially
  
}

export function updateTask(id, title, completed) {
  return db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?')
           .run(title, completed ? 1 : 0, id);
}

// TODO: Implement this function
export function deleteTask(id) {
  return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

export function toggleTaskCompleted(id) {
  // Fetch current value then flip it
  const row = db.prepare('SELECT completed FROM tasks WHERE id = ?').get(id);
  if (!row) return null;
  const newVal = row.completed ? 0 : 1;
  return db.prepare(
    `UPDATE tasks
     SET completed = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(newVal, id);
}