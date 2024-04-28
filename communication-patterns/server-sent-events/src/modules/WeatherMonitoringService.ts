import { EventEmitter } from 'stream';
import {
  GovernorateWeatherModel,
  IGovernorateWeather,
} from './GovernorateModel';

class WeatherMonitoringSimulatorService extends EventEmitter {
  private static instance: WeatherMonitoringSimulatorService;
  private readonly updateInterval: number;
  private readonly governorateWeatherModel: GovernorateWeatherModel;

  private constructor(
    updateInterval: number,
    governorateWeatherModel: GovernorateWeatherModel
  ) {
    super();
    this.updateInterval = updateInterval;
    this.governorateWeatherModel = governorateWeatherModel;
    this.startMonitoring();
  }

  public static getInstance(
    updateInterval: number,
    governorateWeatherModel: GovernorateWeatherModel
  ) {
    if (!WeatherMonitoringSimulatorService.instance) {
      WeatherMonitoringSimulatorService.instance =
        new WeatherMonitoringSimulatorService(
          updateInterval,
          governorateWeatherModel
        );
    }

    return WeatherMonitoringSimulatorService.instance;
  }

  private startMonitoring(): void {
    setInterval(async () => {
      const governoratesWeatherData =
        await this.governorateWeatherModel.getAll();

      for (let governorate of governoratesWeatherData) {
        const updatedData = this.updateGovernorateWeatherData(governorate);

        const governorateUpdatedData =
          await this.governorateWeatherModel.update(
            governorate.id,
            updatedData
          );

        if (governorate.temperature !== updatedData.temperature)
          this.emit('temperature', governorateUpdatedData);
        if (governorate.humidity !== updatedData.humidity)
          this.emit('humidity', governorateUpdatedData);
        if (governorate.windSpeed !== updatedData.windSpeed)
          this.emit('windSpeed', governorateUpdatedData);
        if (governorate.weatherDescription !== updatedData.weatherDescription)
          this.emit('weatherDescription', governorateUpdatedData);
      }
    }, this.updateInterval);
  }

  private updateGovernorateWeatherData(
    governorate: IGovernorateWeather
  ): Pick<
    IGovernorateWeather,
    'temperature' | 'humidity' | 'weatherDescription' | 'windSpeed'
  > {
    // simulate random weather changes

    return {
      temperature: governorate.temperature + this.randomChangeFactor,
      humidity: governorate.temperature + this.randomChangeFactor,
      windSpeed: governorate.windSpeed + this.randomChangeFactor,
      weatherDescription:
        this.randomWeatherDescription ?? governorate.weatherDescription,
    };
  }

  private get randomWeatherDescription(): string | undefined {
    if (!this.randomChangeFactor) return undefined;
    const descriptions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Windy'];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private get randomChangeFactor(): number {
    return Math.floor(Math.random() * 3) - 1; // -1, 0, 1
  }
}

export { WeatherMonitoringSimulatorService };
