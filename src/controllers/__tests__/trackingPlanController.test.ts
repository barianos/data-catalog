import request from 'supertest';
import express from 'express';
import {
  createTrackingPlan,
  getAllTrackingPlans,
  getTrackingPlan,
  updateTrackingPlan,
  deleteTrackingPlan,
} from '../trackingPlanController';
import prisma from '../../prisma';


jest.mock('../../prisma', () => ({
  trackingPlan: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  event: {
    create: jest.fn(),
    update: jest.fn(),
  },
  property: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post('/tracking-plans', createTrackingPlan);
app.get('/tracking-plans', getAllTrackingPlans);
app.get('/tracking-plans/:id', getTrackingPlan);
app.put('/tracking-plans/:id', updateTrackingPlan);
app.delete('/tracking-plans/:id', deleteTrackingPlan);

describe('TrackingPlan Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /tracking-plans', () => {
    it('should create a new tracking plan', async () => {
      const trackingPlanData = {
        name: 'User Tracking Plan',
        description: 'Tracks user interactions',
        events: [
          {
            name: 'Product Clicked',
            type: 'track',
            description: 'User clicked on a product',
            additionalProperties: true,
            properties: [
              {
                name: 'productId',
                type: 'string',
                description: 'ID of the product',
                required: true,
              },
            ],
          },
        ],
      };

      (prisma.trackingPlan.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...trackingPlanData,
      });

      const response = await request(app)
        .post('/tracking-plans')
        .send(trackingPlanData)
        .expect(201);

      expect(response.body).toEqual({
        id: 1,
        ...trackingPlanData,
      });
      expect(prisma.trackingPlan.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid data', async () => {
      const invalidTrackingPlanData = {
        name: '',
        description: 'Tracks user interactions',
        events: [
          {
            name: 'Product Clicked',
            type: 'track',
            description: 'User clicked on a product',
            additionalProperties: true,
            properties: [
              {
                name: 'productId',
                type: 'string',
                description: 'ID of the product',
                required: true,
              },
            ],
          },
        ],
      };

      const response = await request(app)
        .post('/tracking-plans')
        .send(invalidTrackingPlanData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /tracking-plans', () => {
    it('should fetch all tracking plans', async () => {
      const trackingPlans = [
        {
          id: 1,
          name: 'User Tracking Plan',
          description: 'Tracks user interactions',
          events: [
            {
              id: 1,
              trackingPlanId: 1,
              eventId: 1,
              additionalProperties: true,
              event: {
                id: 1,
                name: 'Product Clicked',
                type: 'track',
                description: 'User clicked on a product',
              },
              properties: [
                {
                  id: 1,
                  trackingPlanEventId: 1,
                  propertyId: 1,
                  required: true,
                  property: {
                    id: 1,
                    name: 'productId',
                    type: 'string',
                    description: 'ID of the product',
                  },
                },
              ],
            },
          ],
        },
      ];

      (prisma.trackingPlan.findMany as jest.Mock).mockResolvedValue(trackingPlans);

      const response = await request(app)
        .get('/tracking-plans')
        .expect(200);

      expect(response.body).toEqual(trackingPlans);
      expect(prisma.trackingPlan.findMany).toHaveBeenCalled();
    });

    it('should return 500 if fetching tracking plans fails', async () => {
      // Mock Prisma error
      (prisma.trackingPlan.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/tracking-plans')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch tracking plans');
    });
  });

  describe('GET /tracking-plans/:id', () => {
    it('should fetch a tracking plan by ID', async () => {
      const trackingPlanData = {
        id: 1,
        name: 'User Tracking Plan',
        description: 'Tracks user interactions',
        events: [
          {
            id: 1,
            trackingPlanId: 1,
            eventId: 1,
            additionalProperties: true,
            event: {
              id: 1,
              name: 'Product Clicked',
              type: 'track',
              description: 'User clicked on a product',
            },
            properties: [
              {
                id: 1,
                trackingPlanEventId: 1,
                propertyId: 1,
                required: true,
                property: {
                  id: 1,
                  name: 'productId',
                  type: 'string',
                  description: 'ID of the product',
                },
              },
            ],
          },
        ],
      };

      (prisma.trackingPlan.findUnique as jest.Mock).mockResolvedValue(trackingPlanData);

      const response = await request(app)
        .get('/tracking-plans/1')
        .expect(200);

      expect(response.body).toEqual(trackingPlanData);
      expect(prisma.trackingPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if tracking plan is not found', async () => {
      (prisma.trackingPlan.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/tracking-plans/999')
        .expect(404);

      expect(response.body.error).toBe('Tracking plan not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/tracking-plans/invalid-id')
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /tracking-plans/:id', () => {
    it('should update a tracking plan', async () => {
      const trackingPlanData = {
        name: 'User Tracking Plan Updated',
        description: 'Tracks user interactions (updated)',
        events: [
          {
            id: 1,
            name: 'Product Clicked',
            type: 'track',
            description: 'User clicked on a product',
            additionalProperties: true,
            properties: [
              {
                id: 1,
                name: 'productId',
                type: 'string',
                description: 'ID of the product',
                required: true,
              },
            ],
          },
        ],
      };

      (prisma.trackingPlan.update as jest.Mock).mockResolvedValue({
        id: 1,
        ...trackingPlanData,
      });

      const response = await request(app)
        .put('/tracking-plans/1')
        .send(trackingPlanData)
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        ...trackingPlanData,
      });
      expect(prisma.trackingPlan.update).toHaveBeenCalled();
    });

    it('should return 404 if tracking plan is not found', async () => {
      const prismaError = new Error('Tracking plan not found');
    //   prismaError.code = 'P2025';
      (prisma.trackingPlan.update as jest.Mock).mockRejectedValue(prismaError);

      const response = await request(app)
        .put('/tracking-plans/999')
        .send({
          name: 'User Tracking Plan Updated',
          description: 'Tracks user interactions (updated)',
        })
        .expect(404);

      expect(response.body.error).toBe('Tracking plan not found');
    });

    it('should return 400 for invalid data', async () => {
      const invalidTrackingPlanData = {
        name: '', // Invalid: empty name
        description: 'Tracks user interactions (updated)',
      };

      const response = await request(app)
        .put('/tracking-plans/1')
        .send(invalidTrackingPlanData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /tracking-plans/:id', () => {
    it('should delete a tracking plan', async () => {
      (prisma.trackingPlan.delete as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'User Tracking Plan',
        description: 'Tracks user interactions',
      });

      const response = await request(app)
        .delete('/tracking-plans/1')
        .expect(204);

      expect(prisma.trackingPlan.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if tracking plan is not found', async () => {
      const prismaError = new Error('Tracking plan not found');
    //   prismaError.code = 'P2025';
      (prisma.trackingPlan.delete as jest.Mock).mockRejectedValue(prismaError);

      const response = await request(app)
        .delete('/tracking-plans/999')
        .expect(404);

      expect(response.body.error).toBe('Tracking plan not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .delete('/tracking-plans/invalid-id')
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });
});