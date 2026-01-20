import config from './env.js';

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.cors.origin.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
