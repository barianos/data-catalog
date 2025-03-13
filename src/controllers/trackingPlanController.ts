  import { Request, Response } from 'express';
  import prisma from '../prisma';
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  import { CreateTrackingPlanDto, GetTrackingPlanDto, UpdateTrackingPlanDto, DeleteTrackingPlanDto } from '../dto/TrackingPlanDtos';

  export const createTrackingPlan = async (req: Request, res: Response): Promise<void> => {
    const createTrackingPlanDto = plainToInstance(CreateTrackingPlanDto, req.body);
    const errors = await validate(createTrackingPlanDto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(', '),
      }));
      res.status(400).json({ errors: formattedErrors });
      return;
    }

    try {
      const trackingPlan = await prisma.trackingPlan.create({
        data: {
          name: createTrackingPlanDto.name,
          description: createTrackingPlanDto.description,
          events: {
            create: createTrackingPlanDto.events.map(event => ({
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
                create: event.properties.map(property => ({
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
      res.status(400).json({ error: 'Failed to create tracking plan' });
    }
  };

  export const getAllTrackingPlans = async (req: Request, res: Response): Promise<void> => {
    try {
      const trackingPlans = await prisma.trackingPlan.findMany({
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
      res.status(200).json(trackingPlans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tracking plans' });
    }
  };

  export const getTrackingPlan = async (req: Request, res: Response): Promise<void> => {
    const getTrackingPlanDto = plainToInstance(GetTrackingPlanDto, { id: parseInt(req.params.id) });
    const errors = await validate(getTrackingPlanDto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(', '),
      }));
      res.status(400).json({ errors: formattedErrors });
      return;
    }

    try {
      const trackingPlan = await prisma.trackingPlan.findUnique({
        where: { id: getTrackingPlanDto.id },
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
        res.status(404).json({ error: 'Tracking plan not found' });
        return;
      }

      res.status(200).json(trackingPlan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tracking plan' });
    }
  };

  export const updateTrackingPlan = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateTrackingPlanDto = plainToInstance(UpdateTrackingPlanDto, req.body);
    const errors = await validate(updateTrackingPlanDto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(', '),
      }));
      res.status(400).json({ errors: formattedErrors });
      return;
    }

    try {
      const trackingPlan = await prisma.trackingPlan.update({
        where: { id: parseInt(id) },
        data: {
          name: updateTrackingPlanDto.name,
          description: updateTrackingPlanDto.description,
          events: updateTrackingPlanDto.events && {
            upsert: updateTrackingPlanDto.events.map(event => ({
              where: { id: event.id || -1 }, 
              update: {
                additionalProperties: event.additionalProperties,
                event: {
                  update: {
                    name: event.name,
                    type: event.type,
                    description: event.description,
                  },
                },
                properties: event.properties && {
                  upsert: event.properties.map(property => ({
                    where: { id: property.id || -1 }, 
                    update: {
                      required: property.required,
                      property: {
                        update: {
                          name: property.name,
                          type: property.type,
                          description: property.description,
                        },
                      },
                    },
                    create: {
                      required: property.required,
                      property: {
                        create: {
                          name: property.name,
                          type: property.type,
                          description: property.description,
                        },
                      },
                    },
                  })),
                },
              },
              create: {
                additionalProperties: event.additionalProperties,
                event: {
                  create: {
                    name: event.name,
                    type: event.type,
                    description: event.description,
                  },
                },
                properties: event.properties && {
                  create: event.properties.map(property => ({
                    required: property.required,
                    property: {
                      create: {
                        name: property.name,
                        type: property.type,
                        description: property.description,
                      },
                    },
                  })),
                },
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

      res.status(200).json(trackingPlan);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update tracking plan' });
    }
  };

  export const deleteTrackingPlan = async (req: Request, res: Response): Promise<void> => {
    const deleteTrackingPlanDto = plainToInstance(DeleteTrackingPlanDto, { id: parseInt(req.params.id) });
    const errors = await validate(deleteTrackingPlanDto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(', '),
      }));
      res.status(400).json({ errors: formattedErrors });
      return;
    }

    try {
      await prisma.trackingPlan.delete({
        where: { id: deleteTrackingPlanDto.id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete tracking plan' });
    }
  };