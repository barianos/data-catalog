import { Request, Response } from 'express';
import prisma from '../prisma';

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  const { name, type, description } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        name,
        type,
        description,
      },
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
// export const getEventById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const event = await prisma.event.findUnique({
//       where: { id: parseInt(id) },
//     });
//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.status(200).json(event);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch event' });
//   }
// };

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return; // Explicitly return to avoid further execution
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  };

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, description } = req.body;

  try {
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        description,
      },
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update event' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete event' });
  }
};