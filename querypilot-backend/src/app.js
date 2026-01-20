import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import corsOptions from './config/cors.js';
import { generalLimiter } from './config/rateLimit.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
import ApiError from './utils/apiError.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter);

app.use('/api', routes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
