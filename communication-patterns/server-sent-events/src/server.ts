import express, { Request, Response } from 'express';
import morgan from 'morgan';
import * as path from 'path';
import {
  GovernorateWeatherModel,
  IGovernorateWeather,
} from './modules/GovernorateModel';
import { WeatherMonitoringSimulatorService } from './modules/WeatherMonitoringService';

const app = express();
const PORT = 3000;
const governorateWeatherModel = new GovernorateWeatherModel(
  path.join(__dirname, '..', 'data', 'governoratesWeather.data.json')
);
const WeatherMonitoringService = WeatherMonitoringSimulatorService.getInstance(
  30000,
  governorateWeatherModel
);

app.use(morgan('dev'));

app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const governoratesWeatherData = await governorateWeatherModel.getAll();
    res.status(200).json({
      success: true,
      message: 'Weather data retrieved successfully!',
      data: {
        governoratesWeatherData,
        count: governoratesWeatherData.length,
      },
    });
  } catch (error) {
    console.error('Error getting governorates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/weather/monitoring', (req: Request, res: Response) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'Keep-alive');
  res.setHeader('Cache-control', 'no-cache');

  // Event listener for temperature changes
  WeatherMonitoringService.on('temperature', (data: IGovernorateWeather) => {
    const { id, name, temperature } = data;
    res.write(`event: temperature\n`);
    res.write(`data: ${JSON.stringify({ id, name, temperature })}\n\n`);
  });

  // Event listener for humidity changes
  WeatherMonitoringService.on('humidity', (data: IGovernorateWeather) => {
    const { id, name, humidity } = data;
    res.write(`event: humidity\n`);
    res.write(`data: ${JSON.stringify({ id, name, humidity })}\n\n`);
  });

  // Event listener for weather description changes
  WeatherMonitoringService.on(
    'weatherDescription',
    (data: IGovernorateWeather) => {
      const { id, name, weatherDescription } = data;
      res.write(`event: weatherDescription\n`);
      res.write(
        `data: ${JSON.stringify({ id, name, weatherDescription })}\n\n`
      );
    }
  );

  // Event listener for wind speed changes
  WeatherMonitoringService.on('windSpeed', (data: IGovernorateWeather) => {
    const { id, name, windSpeed } = data;
    res.write(`event: windSpeed\n`);
    res.write(`data: ${JSON.stringify({ id, name, windSpeed })}\n\n`);
  });

  req.on('close', () => {
    WeatherMonitoringService.removeAllListeners();
  });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is live!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
