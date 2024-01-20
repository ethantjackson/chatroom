import express, { Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions, Document } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routers/UserRouter.ts';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenvConfig = dotenv.config({ path: `${__dirname}/.env` });

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors()
  // cors({
  //   credentials: true,
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   origin: [process.env.CLIENT_URL || 'https://localhost:3000'],
  // })
);

const mongo_uri = process.env.MONGO_URI || '';
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.log('Error connecting to MongoDB: ', err);
  });

app.get('/health-check', (req, res) => {
  res.status(200).send('OK');
});

app.use('/user', userRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
