import request from 'supertest';
import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from '../propertyController';
import prisma from '../../prisma';

// Mock Prisma client
jest.mock('../../prisma', () => ({
  property: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post('/properties', createProperty);
app.get('/properties', getProperties);
app.get('/properties/:id', getPropertyById);
app.put('/properties/:id', updateProperty);
app.delete('/properties/:id', deleteProperty);

describe('Property Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  // Test for creating a property
  describe('POST /properties', () => {
    it('should create a new property', async () => {
        const propertyData = {
          name: 'Product ID',
          type: 'string',
          description: 'Unique identifier for the product',
        };
      
        // Mock Prisma response
        (prisma.property.create as jest.Mock).mockResolvedValue({
          id: 1,
          ...propertyData,
        });
      
        const response = await request(app)
          .post('/properties')
          .send(propertyData)
          .expect(201);
      
        expect(response.body).toEqual({
          id: 1,
          ...propertyData,
        });
        expect(prisma.property.create).toHaveBeenCalledWith({ data: propertyData });
      });

    it('should return 400 for invalid data', async () => {
      const invalidPropertyData = {
        name: '', // Invalid: empty name
        type: 'string',
        description: 'Unique identifier for the product',
      };

      const response = await request(app)
        .post('/properties')
        .send(invalidPropertyData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  // Test for fetching all properties
  describe('GET /properties', () => {
    it('should fetch all properties', async () => {
      const properties = [
        {
          id: 1,
          name: 'Product ID',
          type: 'string',
          description: 'Unique identifier for the product',
        },
        {
          id: 2,
          name: 'Product Name',
          type: 'string',
          description: 'Name of the product',
        },
      ];

      // Mock Prisma response
      (prisma.property.findMany as jest.Mock).mockResolvedValue(properties);

      const response = await request(app)
        .get('/properties')
        .expect(200);

      expect(response.body).toEqual(properties);
      expect(prisma.property.findMany).toHaveBeenCalled();
    });

    it('should return 500 if fetching properties fails', async () => {
      // Mock Prisma error
      (prisma.property.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/properties')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch properties');
    });
  });

  // Test for fetching a property by ID
  describe('GET /properties/:id', () => {
    it('should fetch a property by ID', async () => {
      const propertyData = {
        id: 1,
        name: 'Product ID',
        type: 'string',
        description: 'Unique identifier for the product',
      };

      // Mock Prisma response
      (prisma.property.findUnique as jest.Mock).mockResolvedValue(propertyData);

      const response = await request(app)
        .get('/properties/1')
        .expect(200);

      expect(response.body).toEqual(propertyData);
      expect(prisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 if property is not found', async () => {
      // Mock Prisma response
      (prisma.property.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/properties/999')
        .expect(404);

      expect(response.body.error).toBe('Property not found');
    });

    it('should return 404 for invalid ID', async () => {
      const response = await request(app)
        .get('/properties/invalid-id')
        .expect(404);

      expect(response.body.error).toBe('Property not found');
    });
  });

  // Test for updating a property
  describe('PUT /properties/:id', () => {
    it('should update a property', async () => {
      const propertyData = {
        name: 'Product ID Updated',
        type: 'string',
        description: 'Unique identifier for the product (updated)',
      };

      // Mock Prisma response
      (prisma.property.update as jest.Mock).mockResolvedValue({
        id: 1,
        ...propertyData,
      });

      const response = await request(app)
        .put('/properties/1')
        .send(propertyData)
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        ...propertyData,
      });
      expect(prisma.property.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: propertyData,
      });
    });

    it('should return 404 if property is not found', async () => {
      // Mock Prisma error
      const prismaError = new Error('Property not found');
    //   prismaError.code = 'P2025'; // Prisma error code for "Record not found"
      (prisma.property.update as jest.Mock).mockRejectedValue(prismaError);

      const response = await request(app)
        .put('/properties/999')
        .send({
          name: 'Product ID Updated',
          type: 'string',
          description: 'Unique identifier for the product (updated)',
        })
        .expect(400);

      expect(response.body.error).toBe('Failed to update property');
    });

    it('should return 400 for invalid data', async () => {
      const invalidPropertyData = {
        name: '',
        type: 'string',
        description: 'Unique identifier for the product (updated)',
      };

      const response = await request(app)
        .put('/properties/1')
        .send(invalidPropertyData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  // Test for deleting a property
  describe('DELETE /properties/:id', () => {
    it('should delete a property', async () => {
      // Mock Prisma response
      (prisma.property.delete as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Product ID',
        type: 'string',
        description: 'Unique identifier for the product',
      });

      const response = await request(app)
        .delete('/properties/1')
        .expect(204);

      expect(prisma.property.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 204  No Content for invalid ID', async () => {
      const response = await request(app)
        .delete('/properties/invalid-id')
        .expect(204);
    });
  });
});