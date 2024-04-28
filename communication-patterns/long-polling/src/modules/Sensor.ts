class Sensor {
  public readonly name: string;
  private _value: number;
  private _updatedAt: Date;
  public readonly unit: string;

  constructor(name: string, initialValue: number, unit: string) {
    this.name = name;
    this._value = initialValue;
    this._updatedAt = new Date();
    this.unit = unit;
  }

  public updateValue(): number {
    const change = Math.floor(Math.random() * 3) - 1; // 1, 0, -1
    this._value += change;
    this._updatedAt = new Date();
    return this._value;
  }

  public get value(): number {
    return this._value;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}

export { Sensor };
