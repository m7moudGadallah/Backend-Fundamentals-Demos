import sharp from '../node_modules/sharp/lib/index';

class ImageResizingService {
  constructor() {}

  static async resize(
    filePath: string,
    height: number,
    width: number,
    resizedImagePath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await sharp(filePath).resize(width, height).toFile(resizedImagePath);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 30 * 1000);
    });
  }
}

export { ImageResizingService };
