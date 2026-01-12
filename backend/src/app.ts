import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MockRound.AI Backend is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    instance: process.env.RENDER_INSTANCE_ID || 'local',
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/lb-check', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export default app;
