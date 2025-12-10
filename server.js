import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import usersRouter from './routes/users.js';
import tasksRouter from './routes/tasks.js';  // New tasks router import


const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true })); // body parser

app.get('/', (req, res) => res.render('home', { title: 'Home' }));

app.use('/users', usersRouter);

app.use('/tasks', tasksRouter); // Task routes

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
