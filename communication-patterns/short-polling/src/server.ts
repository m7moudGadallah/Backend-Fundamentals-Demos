import express, { Request } from 'express';
import {
  IImageResizingJob,
  ImageResizingJobProcessor,
} from './ImageResizingJobProcessor';
import { imageMulterUpload } from './multerUpload';
import * as path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import morgan from 'morgan';

const app = express();

const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;

const imageResizingJobProcessor = ImageResizingJobProcessor.getInstance();

app.use(morgan('dev'));

app.post(
  '/api/images/resize',
  imageMulterUpload,
  (req: Request<any, any, { width: string; height: string }>, res) => {
    console.log(req.file);
    const imageName: string = (req.file as Express.Multer.File).filename;
    const imagePath: string = path.join(__dirname, '..', 'uploads', imageName);
    const jobId: string = imageName.split('.').shift() as string;

    const job: IImageResizingJob = {
      id: jobId,
      submittedAt: new Date(),
      status: 'submitted',
      meta: {
        imagePath,
        imageName,
        height: parseInt(req.body.height),
        width: parseInt(req.body.width),
        resizedImagePath: path.join(__dirname, '..', 'images', imageName),
      },
    };

    imageResizingJobProcessor.processJob(job);

    res.status(200).json({
      success: true,
      message: 'Image submitted successfully!',
      imageId: jobId,
    });
  }
);

app.get('/api/images/:imageId/status', (req, res) => {
  try {
    const { imageId } = req.params;
    const job = imageResizingJobProcessor.getJob(imageId);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found!',
      });
    } else if (job.status === 'completed') {
      res.status(200).json({
        success: true,
        status: job.status,
        imageUrl: `${SERVER_URL}/api/images/${job.meta.imageName}`,
      });
    } else {
      res.status(200).json({
        success: true,
        status: job.status,
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.get('/api/images/:imageName', async (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, '..', 'images', imageName);

  try {
    await promisify(fs.stat)(imagePath);

    // Create a readable stream to send the file in chunks
    const stream = fs.createReadStream(imagePath);

    // Set the appropriate headers
    res.setHeader('Content-Type', `image/${path.extname(imageName)}`);
    res.setHeader('Content-Disposition', `attachment; ${imageName}`);

    // Pipe the file stream to the response
    stream.pipe(res);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Image not found!',
    });
  }
});

app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is live!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
