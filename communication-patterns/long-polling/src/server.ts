import express, { Request, Response } from 'express';
import morgan from 'morgan';
import { SensorSimulationService } from './modules/SensorSimulationService';

const app = express();
const PORT = 3000;
const READINGS_UPDATING_INTERVAL_MS = 60 * 1000;
const sensorSimulationService: SensorSimulationService =
  SensorSimulationService.getInstance(READINGS_UPDATING_INTERVAL_MS);

app.use(morgan('dev'));

app.get('/api/sensors', (req: Request, res: Response) => {
  const sensors = sensorSimulationService.getSensorReadings();

  res.status(200).json({
    success: true,
    message: 'Sensors readings retrieved successfully!',
    data: {
      sensors,
    },
    timeStamp: new Date(),
  });
});

app.get(
  '/api/sensors/updates',
  async (
    req: Request<any, any, any, { lastUpdateDate?: string }>,
    res: Response
  ) => {
    if (!req.query.lastUpdateDate) {
      return res.status(400).json({
        success: false,
        message: 'lastUpdateDate is required!',
      });
    }

    const lastUpdateDate = new Date(req.query.lastUpdateDate);

    const readingUpdates =
      sensorSimulationService.getReadingUpdates(lastUpdateDate);

    if (readingUpdates.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Sensors updated reading retrieved successfully!',
        data: {
          updates: readingUpdates,
        },
        timeStamp: new Date(),
      });
    }

    const updatePromise = new Promise((resolve) => {
      sensorSimulationService.on('update', (updates) => {
        resolve(updates);
      });
    });

    while (true) {
      const updates = await Promise.race([
        updatePromise,
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
          }, 5000);
        }),
      ]);

      if (updates) {
        return res.status(200).json({
          success: true,
          message: 'Sensors updated reading retrieved successfully!',
          data: {
            updates,
          },
          timeStamp: new Date(),
        });
      }
    }
  }
);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is live!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
