import { Request, Response } from 'express';
import prisma from '../prisma';
import { plainToInstance } from 'class-transformer';
import { CreatePropertyDto, UpdatePropertyDto } from '../dto/PropertyDtos';
import { validate } from 'class-validator';

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  console.log("updated property file");
  const createPropertyDto = plainToInstance(CreatePropertyDto, req.body);
  const errors = await validate(createPropertyDto);

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const property = await prisma.property.create({
      data: createPropertyDto,
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

  const updatePropertyDto = plainToInstance(UpdatePropertyDto, req.body);
  const errors = await validate(updatePropertyDto);

  if (errors.length > 0) {
    const formattedErrors = errors.map(err => ({
      field: err.property,
      message: Object.values(err.constraints || {}).join(', '),
    }));
    res.status(400).json({ errors: formattedErrors });
    // res.status(400).json({ errors });
    // return;
  }

  try {
    const property = await prisma.property.update({
      where: { id: parseInt(id) },
      data: updatePropertyDto,
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