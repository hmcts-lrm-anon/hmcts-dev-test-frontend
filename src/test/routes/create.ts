import { app } from '../../main/app';

import axios from 'axios';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

// Mock axios (backend)
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Create routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks/create', () => {
    test('should return create task form', async () => {
      await request(app)
        .get('/tasks/create')
        .expect(StatusCodes.OK)
        .expect(res => {
          // smoke test that we got the create form page
          expect(res.text).to.include('Create Task');
          expect(res.text).to.include('<form');
        });
    });
  });

  describe('POST /tasks/create', () => {
    test('should return 400 for invalid date format', async () => {
      await request(app)
        .post('/tasks/create')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          dueDateTime: 'invalid-date'
        })
        .expect(StatusCodes.BAD_REQUEST)
        .expect(res => {
          expect(res.text).to.include('must be a valid date and time');
        });
    });

    test('should return 400 for missing date', async () => {
      await request(app)
        .post('/tasks/create')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        })
        .expect(StatusCodes.BAD_REQUEST)
        .expect(res => {
          expect(res.text).to.include('must be a valid date and time');
        });
    });

    test('should redirect on valid submission', async () => {
      // Mock successful axios POST request
      mockedAxios.post.mockResolvedValueOnce({ data: { id: 123 } });

      await request(app)
        .post('/tasks/create')
        .send({
          title: 'Valid Test Task',
          description: 'Valid Test Description',
          status: 'OPEN',
          dueDateTime: '2025-12-31T23:59:00'
        })
        // verify redirect to /tasks on success
        .expect(StatusCodes.MOVED_TEMPORARILY)
        .expect('Location', '/tasks');
    });

    test('should handle backend unavailable', async () => {
      // Mock axios failure
      mockedAxios.post.mockRejectedValueOnce(new Error('Backend unavailable'));
  
      await request(app)
        .post('/tasks/create')
        .send({
          title: 'Valid Test Task',
          description: 'Valid Test Description', 
          status: 'OPEN',
          dueDateTime: '2025-12-31T23:59:00'
        })
        .expect(res => {
          // verify got error response and the user sees expected message
          expect(res.status).to.be.at.least(400);
          expect(res.text).to.include('Failed to create task');
        });
    }); 
  });
});