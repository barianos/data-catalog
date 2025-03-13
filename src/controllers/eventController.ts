import { Request, Response } from 'express';
import prisma from '../prisma';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEventDto, UpdateEventDto } from '../dto/EventDtos';

// Create a new event
export const createEvent = async (req: Request, res: Response) :Promise<any> => {
  const createEventDto = plainToInstance(CreateEventDto, req.body);
  const errors = await validate(createEventDto);

  if (errors.length > 0) {
    const formattedErrors = errors.map(err => ({
      field: err.property,
      message: Object.values(err.constraints || {}).join(', '),
    }));
    return res.status(400).json({ errors: formattedErrors });
  }

  try {
    const event = await prisma.event.create({
      data: createEventDto,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create event' });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get a specific event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) :Promise<any> => {
  const { id } = req.params;
  const updateEventDto = plainToInstance(UpdateEventDto, req.body);
  const errors = await validate(updateEventDto);

  if (errors.length > 0) {
    const formattedErrors = errors.map(err => ({
      field: err.property,
      message: Object.values(err.constraints || {}).join(', '),
    }));
    return res.status(400).json({ errors: formattedErrors });
  }

  try {
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: updateEventDto,
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update event' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) :Promise<void> => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }

  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete event' });
  }
};