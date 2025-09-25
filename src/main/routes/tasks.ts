import { Application, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { HTTPError } from '../HttpError';

// Utility function to handle HTTP request errors consistently
function handleHttpRequestError(error: any, fallbackMessage: string, next: NextFunction): void {
  
  if (error?.response?.status) {
    // Backend responded with an error status - use that status and message
    const status = error.response.status;
    const message = error.response.data?.message || fallbackMessage;
    next(new HTTPError(message, status));
    return;
  } 
  else if (error?.code && (error.code === 'ECONNREFUSED' || 
                           error.code === 'ETIMEDOUT' || 
                           error.code === 'ENOTFOUND' ||
                           error.code === 'ECONNRESET')) {
    next(new HTTPError(fallbackMessage, StatusCodes.SERVICE_UNAVAILABLE));
    return;
  }
  // Everything else is treated as an internal application error
  next(new HTTPError(fallbackMessage, StatusCodes.INTERNAL_SERVER_ERROR));
}

export default function (app: Application): void {
  // Show delete confirmation page
  app.get('/tasks/:id/delete', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
      const task = response.data;
      res.render('task-delete', { task });
    } catch (error) {
      handleHttpRequestError(error, 'Failed to fetch task for delete confirmation', next);
    }
  });
  // List all tasks
  app.get('/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      const tasks = response.data;
      res.render('tasks', { tasks });
    } catch (error) {
      handleHttpRequestError(error, 'Failed to fetch tasks', next);
    }
  });
  
  // Show create form
  app.get('/tasks/create', (req: Request, res: Response) => {
    res.render('task-create');
  });
  
  // Handle create form submission
  app.post('/tasks/create', async (req: Request, res: Response, next: NextFunction) => {
    const { dueDateTime } = req.body;
    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!isoPattern.test(dueDateTime)) {
      const errors = [{ text: 'Due Date & Time must be a valid date and time', href: '#dueDateTime' }];
      return res.status(StatusCodes.BAD_REQUEST).render('task-create', { errors });
    }
    try {
      await axios.post('http://localhost:4000/tasks', req.body);
      res.redirect('/tasks');
    } catch (error) {
      handleHttpRequestError(error, 'Failed to create task', next);
    }
  });
  
  // Show edit form
  app.get('/tasks/:id/edit', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
      const task = response.data;
      res.render('task-edit', { task });
    } catch (error) {
      handleHttpRequestError(error, 'Failed to fetch task', next);
    }
  });
  
  // Handle edit form submission
  app.post('/tasks/:id/edit', async (req: Request, res: Response, next: NextFunction) => {
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
      handleHttpRequestError(error, 'Failed to update task', next);
    }
  });
  
  // Handle delete
  app.post('/tasks/:id/delete', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${req.params.id}`);
      res.redirect('/tasks');
    } catch (error) {
      handleHttpRequestError(error, 'Failed to delete task', next);
    }
  });
}
