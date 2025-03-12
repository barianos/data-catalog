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
} from './controllers/trackingPlanController';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/events', createEvent);
app.get('/events', getEvents);
app.get('/events/:id', getEventById);
app.put('/events/:id', updateEvent);
app.delete('/events/:id', deleteEvent);

app.post('/properties', createProperty);
app.get('/properties', getProperties);
app.get('/properties/:id', getPropertyById);
app.put('/properties/:id', updateProperty);
app.delete('/properties/:id', deleteProperty);

app.post('/tracking-plans', createTrackingPlan);
app.get('/tracking-plans/:id', getTrackingPlan);

app.get('/', (req: Request, res: Response) => {
  console.log('Data Catalog!'); // Add this line
  res.send('Data Catalog API is running!');
});

app.get('/test', (req: Request, res: Response) => {
  console.log('Test route hit!'); // Add this line
  res.status(200).json({ message: 'Test route works!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});