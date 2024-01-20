import express, { Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions, Document } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routers/UserRouter.ts';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

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

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const messageData = JSON.parse(message.toString());
        client.send(JSON.stringify(messageData));
      }
    });
  });

  ws.on('close', () => {
    console.log('closing connection');
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
