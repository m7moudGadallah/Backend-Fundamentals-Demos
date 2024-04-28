import { randomUUID } from 'crypto';
import fs from 'fs';
import { promisify } from 'util';

interface IGovernorateWeather {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  weatherDescription: string;
  windSpeed: number;
  date: Date;
}

class GovernorateWeatherModel {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public async getAll(): Promise<IGovernorateWeather[]> {
    return await this.readData();
  }

  public async getById(id: string): Promise<IGovernorateWeather | undefined> {
    return (await this.readData()).find((governorate) => governorate.id === id);
  }

  public async create(
    data: Omit<IGovernorateWeather, 'id' | 'date'>
  ): Promise<IGovernorateWeather> {
    const weatherData = await this.readData();
    const createdObj: IGovernorateWeather = {
      id: randomUUID(),
      ...data,
      date: new Date(),
    };

    weatherData.push(createdObj);
    await this.writeData(weatherData);
    return createdObj;
  }

  public async update(
    id: string,
    data: Partial<Omit<IGovernorateWeather, 'id' | 'date'>>
  ): Promise<IGovernorateWeather> {
    const weatherData = await this.readData();
    const governorateIndex: number = weatherData.findIndex(
      (governorate) => governorate.id === id
    );

    if (governorateIndex < 0) throw new Error(`Governorate not found!`);

    weatherData[governorateIndex] = {
      ...weatherData[governorateIndex],
      ...data,
      date: new Date(),
    };

    await this.writeData(weatherData);

    return weatherData[governorateIndex];
  }

  private async readData(): Promise<IGovernorateWeather[]> {
    try {
      return JSON.parse(
        await promisify(fs.readFile)(this.filePath, { encoding: 'utf-8' })
      );
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  private async writeData(data: IGovernorateWeather[]): Promise<void> {
    try {
      await promisify(fs.writeFile)(
        this.filePath,
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }
}

export { GovernorateWeatherModel };
export type { IGovernorateWeather };
