import express from 'express';
import { 
  getTasksByUser, 
  addTask, 
  updateTask, 
  toggleTaskCompleted, 
  deleteTask 
} from '../db/taskModel.js';  // Adjusted to use one import path

import { getAllUsers } from '../db/userModel.js';

const router = express.Router();

// List tasks for a user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Call the function to retrieve tasks from the database using the user ID
    const tasks = await getTasksByUser(userId);
    
    // Send the retrieved tasks as a JSON response or render the view
    if (tasks.length > 0) {
      res.render('tasks/index', { title: `Tasks for ${userId}`, tasks, user: { id: userId } });
    } else {
      res.status(404).json({ message: `No tasks found for user ${userId}` });
    }
  } catch (error) {
    // Handle potential database errors
    console.error('Error fetching tasks for user:', userId, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add task
router.post('/add', (req, res) => {
  const { user_id, title } = req.body;
  if (!title || !user_id) return res.status(400).send('Missing fields');
  
  addTask(user_id, title.trim());
  res.redirect(`/tasks/user/${user_id}`);
});

// Update task (full edit: title + completed)
router.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, user_id } = req.body;
  if (!title || !user_id) return res.status(400).send('Missing fields');

  // Convert completed to boolean
  const completedBool = completed === 'on' || completed === '1' || completed === true;
  updateTask(id, title.trim(), completedBool);
  res.redirect(`/tasks/user/${user_id}`);
});

// Toggle completion quickly (no title change)
router.post('/toggle/:id', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body; // receive user_id to redirect back
  
  toggleTaskCompleted(id); // Toggle completion status
  res.redirect(`/tasks/user/${user_id}`);
});

// Delete task
router.post('/delete/:id', async (req, res, next) => {
  const taskId = parseInt(req.params.id); // Parse the task ID from the URL parameter
  const userId = req.body.user_id; // Use consistent naming for user ID

  try {
    // Call the deleteTask function from the model to delete from the database
    const changes = await deleteTask(taskId);

    if (changes === 0) {
      return res.status(404).json({ message: 'Task not found' }); // Task not found
    }

    // Redirect back to the user's task list
    res.redirect(`/tasks/user/${userId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    next(error);  // Pass any error to the Express error handler
  }
});

export default router;
