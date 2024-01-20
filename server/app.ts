import express, { Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions, Document } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User, { IUser } from './schemas/UserSchema.ts';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';

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

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No jwt provided' });
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid jwt' });
    }
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    req.userId = (user as jwt.JwtPayload).userId;
    next();
  });
};

app.get(
  '/get-authenticated-user',
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    User.findById(req.userId)
      .then((user) => {
        if (user) {
          return res.status(200).json({ user });
        }
        return res.status(403).json({ message: 'User not found' });
      })
      .catch((err: Error) => {
        console.log(err);
        res.status(500).json({ message: 'Could not get authenticated user' });
      });
  }
);

app.post('/register', (req, res) => {
  req.body.username = req.body.username.toLowerCase();
  const { username } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: 'Username is already in use' });
      }
      const newUser = new User(req.body);
      newUser
        .save()
        .then(() => {
          res.status(201).json({ message: 'Account successfully created' });
        })
        .catch((err: Error) => {
          console.log(err);
          res.status(500).json({ message: 'Error saving user' });
        });
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(500).json({ message: 'Could not register user' });
    });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Username not found' });
      }
      user.comparePasswords(password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in' });
        }
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'secretKey', {
          expiresIn: '1h',
        });
        res.status(200).json({ token, user });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Error logging in' });
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
