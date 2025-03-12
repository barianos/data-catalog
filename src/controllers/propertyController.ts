import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new property
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  const { name, type, description } = req.body;

  try {
    const property = await prisma.property.create({
      data: {
        name,
        type,
        description,
      },
    });
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create property' });
  }
};

// Get all properties
export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await prisma.property.findMany();
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Get a specific property by ID
export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) },
    });

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// Update a property
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, type, description } = req.body;

  try {
    const property = await prisma.property.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        description,
      },
    });
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update property' });
  }
};

// Delete a property
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.property.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to delete property' });
  }
};