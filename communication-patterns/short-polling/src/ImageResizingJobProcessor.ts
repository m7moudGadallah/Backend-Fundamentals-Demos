import { ImageResizingService } from './ImageResizingService';

interface IImageResizingJob {
  id: string;
  submittedAt: Date;
  finishedAt?: Date;
  status: 'submitted' | 'in progress' | 'completed';
  meta: {
    imagePath: string;
    imageName: string;
    height: number;
    width: number;
    resizedImagePath: string;
  };
}

class ImageResizingJobProcessor {
  private static instance: ImageResizingJobProcessor;
  private readonly jobQueue: IImageResizingJob[];
  private readonly jobMap: Map<string, IImageResizingJob>;

  private constructor() {
    this.jobQueue = [];
    this.jobMap = new Map();
  }

  public static getInstance(): ImageResizingJobProcessor {
    if (!ImageResizingJobProcessor.instance) {
      ImageResizingJobProcessor.instance = new ImageResizingJobProcessor();
      ImageResizingJobProcessor.instance.startProcessing();
    }

    return ImageResizingJobProcessor.instance;
  }

  startProcessing() {
    setInterval(async () => {
      const job = this.jobQueue.shift();
      if (job) {
        await this.processJob(job);
      }
    }, 2 * 1000);
  }

  async processJob(job: IImageResizingJob): Promise<void> {
    this.jobMap.set(job.id, {
      ...job,
      status: 'in progress',
    });

    const { meta } = job;

    await ImageResizingService.resize(
      meta.imagePath,
      meta.height,
      meta.width,
      meta.resizedImagePath
    );

    this.jobMap.set(job.id, {
      ...job,
      status: 'completed',
      finishedAt: new Date(),
    });
  }

  public addJob(job: IImageResizingJob): void {
    this.jobMap.set(job.id, job);
    this.jobQueue.push(job);
  }

  public getJob(jobId: string): IImageResizingJob | undefined {
    return this.jobMap.get(jobId);
  }
}

export { ImageResizingJobProcessor };
export type { IImageResizingJob };
