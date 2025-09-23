import { Application, Request, Response } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  // Show delete confirmation page
  app.get('/tasks/:id/delete', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
      const task = response.data;
  res.render('task-delete', { task });
    } catch (error) {
      res.status(500).send('Failed to fetch task for delete confirmation');
    }
  });
  // List all tasks
  app.get('/tasks', async (req: Request, res: Response) => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      const tasks = response.data;
      res.render('tasks', { tasks });
    } catch (error) {
      res.status(500).send('Failed to fetch tasks');
    }
  });
  
  // Show create form
  app.get('/tasks/create', (req: Request, res: Response) => {
    res.render('task-create');
  });
  
  // Handle create form submission
  app.post('/tasks/create', async (req: Request, res: Response) => {
    const { dueDateTime } = req.body;
    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!isoPattern.test(dueDateTime)) {
      const errors = [{ text: 'Due Date & Time must be a valid date and time', href: '#dueDateTime' }];
      return res.status(400).render('task-create', { errors });
    }
    try {
      await axios.post('http://localhost:4000/tasks', req.body);
      res.redirect('/tasks');
    } catch (error) {
      res.status(500).send('Failed to create task');
    }
  });
  
  // Show edit form
  app.get('/tasks/:id/edit', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
      const task = response.data;
      res.render('task-edit', { task });
    } catch (error) {
      res.status(500).send('Failed to fetch task');
    }
  });
  
  // Handle edit form submission
  app.post('/tasks/:id/edit', async (req: Request, res: Response) => {
    try {
      const { title, description, status, dueDateTime } = req.body;
      const updatedTask = {
        id: req.params.id,
        title,
        description,
        status,
        dueDateTime
      };
      console.log('EDIT SUBMIT:', {
        id: req.params.id,
        body: updatedTask
      });
      await axios.put(`http://localhost:4000/tasks/${req.params.id}`, updatedTask);
      res.redirect('/tasks');
    } catch (error) {
      res.status(500).send('Failed to update task');
    }
  });
  
  // Handle delete
  app.post('/tasks/:id/delete', async (req: Request, res: Response) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${req.params.id}`);
      res.redirect('/tasks');
    } catch (error) {
      res.status(500).send('Failed to delete task');
    }
  });
}
