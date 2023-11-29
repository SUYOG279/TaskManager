import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:3001/tasks/all')
      .then(response => setTasks(response.data))
      .catch(error => {
        console.error('Error fetching tasks:', error);
        toast.error('Error fetching tasks');
      });
  };

  const addTask = () => {
    if (!taskName) {
      toast.error('Task name is required');
      return;
    }

    axios.post('http://localhost:3001/tasks/new', { taskName })
      .then(response => {
        setTasks([...tasks, response.data]);
        setTaskName('');
        toast.success('Task added successfully');
      })
      .catch(error => {
        console.error('Error adding task:', error);
        toast.error('Error adding task');
      });
  };

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:3001/tasks/${taskId}/delete`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        toast.error('Error deleting task');
      });
  };

  const startEditing = (taskId, taskName) => {
    setEditingTaskId(taskId);
    setEditingTaskName(taskName);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
  };

  const saveEditing = () => {
    if (!editingTaskName) {
      toast.error('Task name is required');
      return;
    }

    axios.put(`http://localhost:3001/tasks/${editingTaskId}/update`, { taskName: editingTaskName })
      .then(() => {
        fetchTasks();
        cancelEditing();
        toast.success('Task updated successfully');
      })
      .catch(error => {
        console.error('Error updating task:', error);
        toast.error('Error updating task');
      });
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark shadow">
        <div className="container">
          <a className="navbar-brand" href="#">
            Task Manager
          </a>
        </div>
      </nav>

      <div className="container mt-4">
        <h1 className="text-center mb-4">Task List</h1>
        <div className="mb-3 d-flex justify-content-center">
          <input
            type="text"
            className="form-control mr-2"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addTask}>Add Task</button>
        </div>
        <div className="row">
          {tasks.map(task => (
            <div key={task.id} className="col-md-4 mb-4">
              <div className={`card ${editingTaskId === task.id ? 'border-primary' : ''}`}>
                <div className="card-body">
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editingTaskName}
                      onChange={(e) => setEditingTaskName(e.target.value)}
                    />
                  ) : (
                    <h5 className="card-title">{task.taskName}</h5>
                  )}
                  <div className="d-flex justify-content-between">
                    <div>
                      <button className="btn btn-warning me-2" onClick={() => startEditing(task.id, task.taskName)}>Update</button>
                      <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                    {editingTaskId === task.id && (
                      <div>
                        <button className="btn btn-success" onClick={saveEditing}>Save</button>
                        <button className="btn btn-secondary ms-2" onClick={cancelEditing}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default App;
