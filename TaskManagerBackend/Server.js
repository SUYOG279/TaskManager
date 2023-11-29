const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'taskmangar',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

// CRUD Operations

// Create a task
app.post('/tasks/new', (req, res) => {
  const { taskName } = req.body;
  if (!taskName) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  db.query('INSERT INTO tasks (taskName) VALUES (?)', [taskName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ id: result.insertId, taskName });
  });
});

// Read all tasks
app.get('/tasks/all', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Update a task
app.put('/tasks/:id/update', (req, res) => {
  const { id } = req.params;
  const { taskName } = req.body;

  if (!taskName) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  db.query('UPDATE tasks SET taskName = ? WHERE id = ?', [taskName, id], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ id, taskName });
  });
});

// Delete a task
app.delete('/tasks/:id/delete', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tasks WHERE id = ?', [id], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
