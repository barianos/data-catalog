import { Request, Response } from 'express';
import prisma from '../prisma';

export const createTrackingPlan = async (req: Request, res: Response): Promise<void> => {
  const { name, description, events } = req.body;

  try {
    const trackingPlan = await prisma.trackingPlan.create({
      data: {
        name,
        description,
        events: {
          create: events.map((event: any) => ({
            additionalProperties: event.additionalProperties,
            event: {
              connectOrCreate: {
                where: { name_type: { name: event.name, type: event.type } },
                create: {
                  name: event.name,
                  type: event.type,
                  description: event.description,
                },
              },
            },
            properties: {
              create: event.properties.map((property: any) => ({
                required: property.required,
                property: {
                  connectOrCreate: {
                    where: { name_type: { name: property.name, type: property.type } },
                    create: {
                      name: property.name,
                      type: property.type,
                      description: property.description,
                    },
                  },
                },
              })),
            },
          })),
        },
      },
      include: {
        events: {
          include: {
            event: true,
            properties: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(trackingPlan);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create tracking plan' });
  }
};

export const getTrackingPlan = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const trackingPlan = await prisma.trackingPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        events: {
          include: {
            event: true,
            properties: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    if (!trackingPlan) {
      return res.status(404).json({ error: 'Tracking plan not found' });
    }

    res.status(200).json(trackingPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tracking plan' });
  }
};