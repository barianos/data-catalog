import request from 'supertest';
import express from 'express';
import { createEvent, getEventById, updateEvent, deleteEvent } from '../eventController';
import prisma from '../../prisma';

jest.mock('../../prisma', () => ({
  event: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post('/events', createEvent);
app.get('/events/:id', getEventById);
app.put('/events/:id', updateEvent);
app.delete('/events/:id', deleteEvent);

describe('Event Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('POST /events', () => {
    it('should create a new event', async () => {
      const eventData = {
        name: 'Product Clicked',
        type: 'track',
        description: 'User clicked on a product',
      };


      (prisma.event.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...eventData,
      });

      const response = await request(app)
        .post('/events')
        .send(eventData)
        .expect(201);

      expect(response.body).toEqual({
        id: 1,
        ...eventData,
      });
      expect(prisma.event.create).toHaveBeenCalledWith({ data: eventData });
    });

    it('should return 400 for invalid data', async () => {
      const invalidEventData = {
        name: '', 
        type: 'track',
        description: 'User clicked on a product',
      };

      const response = await request(app)
        .post('/events')
        .send(invalidEventData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

 
  describe('GET /events/:id', () => {
    it('should fetch an event by ID', async () => {
      const eventData = {
        id: 1,
        name: 'Product Clicked',
        type: 'track',
        description: 'User clicked on a product',
      };

      // Mock Prisma response
      (prisma.event.findUnique as jest.Mock).mockResolvedValue(eventData);

      const response = await request(app)
        .get('/events/1')
        .expect(200);

      expect(response.body).toEqual(eventData);
      expect(prisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if event is not found', async () => {
      // Mock Prisma response
      (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/events/999')
        .expect(404);

      expect(response.body.error).toBe('Event not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/events/invalid-id')
        .expect(400);

      expect(response.body.error).toBe('Invalid event ID');
    });
  });

  // Test for updating an event
  describe('PUT /events/:id', () => {
    it('should update an event', async () => {
      const eventData = {
        name: 'Product Clicked Updated',
        type: 'track',
        description: 'User clicked on a product (updated)',
      };

      // Mock Prisma response
      (prisma.event.update as jest.Mock).mockResolvedValue({
        id: 1,
        ...eventData,
      });

      const response = await request(app)
        .put('/events/1')
        .send(eventData)
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        ...eventData,
      });
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: eventData,
      });
    });

    it('should return 400 if event is not found', async () => {
      // Mock Prisma response
      (prisma.event.update as jest.Mock).mockRejectedValue(new Error('Event not found'));

      const response = await request(app)
        .put('/events/999')
        .send({
          name: 'Product Clicked Updated',
          type: 'track',
          description: 'User clicked on a product (updated)',
        })
        .expect(400);

      expect(response.body.error).toBe('Failed to update event');
    });

    it('should return 400 for invalid data', async () => {
      const invalidEventData = {
        name: '',
        type: 'track',
        description: 'User clicked on a product (updated)',
      };

      const response = await request(app)
        .put('/events/1')
        .send(invalidEventData)
        .expect(400);

        expect(response.body.error).toBeDefined();
    });
  });

  // Test for deleting an event
  describe('DELETE /events/:id', () => {
    it('should delete an event', async () => {
      // Mock Prisma response
      (prisma.event.delete as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Product Clicked',
        type: 'track',
        description: 'User clicked on a product',
      });

      const response = await request(app)
        .delete('/events/1')
        .expect(204);

      expect(prisma.event.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .delete('/events/invalid-id')
        .expect(400);

      expect(response.body.error).toBe('Invalid event ID');
    });
  });
});