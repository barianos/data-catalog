import 'reflect-metadata';
import express, { Request, Response } from 'express';
import {
  createEvent,
  getEvents,
  updateEvent,
  getEventById,
  deleteEvent,
} from './controllers/eventController';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from './controllers/propertyController';
import {
  createTrackingPlan,
  getTrackingPlan,
  updateTrackingPlan,
  deleteTrackingPlan,
  getAllTrackingPlans,
} from './controllers/trackingPlanController';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Event routes
app.post('/events', createEvent);
app.get('/events', getEvents);
app.get('/events/:id', getEventById);
app.put('/events/:id', updateEvent);
app.delete('/events/:id', deleteEvent);

// Property routes
app.post('/properties', createProperty);
app.get('/properties', getProperties);
app.get('/properties/:id', getPropertyById);
app.put('/properties/:id', updateProperty);
app.delete('/properties/:id', deleteProperty);

// Tracking Plan routes
app.post('/tracking-plans', createTrackingPlan);
app.get('/tracking-plans', getAllTrackingPlans);
app.get('/tracking-plans/:id', getTrackingPlan);
app.put('/tracking-plans/:id', updateTrackingPlan);
app.delete('/tracking-plans/:id', deleteTrackingPlan);

app.get('/', (req: Request, res: Response) => {
  res.send('Data Catalog API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});