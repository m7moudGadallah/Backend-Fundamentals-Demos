import { Sensor } from './Sensor';
import EventEmitter from 'events';

class SensorSimulationService extends EventEmitter {
  private static instance: SensorSimulationService;
  private readonly updateInterval: number;
  private readonly sensors: Sensor[];
  private readonly readingUpdates: Sensor[];

  private constructor(updateInterval: number) {
    super();
    this.updateInterval = updateInterval;
    this.sensors = this.initializeSensors();
    this.readingUpdates = [];
    this.start();
  }

  public static getInstance(updateInterval: number): SensorSimulationService {
    if (!SensorSimulationService.instance) {
      SensorSimulationService.instance = new SensorSimulationService(
        updateInterval || 2000
      );
    }
    return SensorSimulationService.instance;
  }

  private initializeSensors(): Sensor[] {
    return [
      new Sensor('Temperature', 25, '°C'),
      new Sensor('Humidity', 50, '%'),
      new Sensor('Pressure', 1013, 'hPa'),
    ];
  }

  private updateSensors(): void {
    this.sensors.forEach((sensor) => {
      const currentValue = sensor.value;
      sensor.updateValue();
      if (sensor.value !== currentValue) {
        this.readingUpdates.push(sensor);
        // Emit 'update' event with sensor information
        this.emit('update', sensor);
      }
    });
  }

  private start(): void {
    setInterval(() => {
      this.updateSensors();
    }, this.updateInterval);
  }

  public getReadingUpdates(date: Date): Sensor[] {
    return this.readingUpdates.filter((sensor) => sensor.updatedAt > date);
  }

  public getSensorReadings(): Record<string, { value: number; unit: string }> {
    const readings: Record<string, { value: number; unit: string }> = {};
    this.sensors.forEach((sensor) => {
      readings[sensor.name] = { value: sensor.value, unit: sensor.unit };
    });
    return readings;
  }
}

export { SensorSimulationService };
