import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import { LocalStorage } from 'node-localstorage';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './schemas/UserSchema.ts';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenvConfig = dotenv.config({ path: `${__dirname}/.env` });
const localStorage = new LocalStorage('./scratch');

app.use(express.json());

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

app.get('/', (req, res) => {
  console.log('trying to get');
  res.status(200).send('OK');
  console.log('res status 200 sent');
});

app.post('/register', (req, res) => {
  console.log('register called');
  req.body.username = req.body.username.toLowerCase();
  const { username } = req.body;
  console.log('attempting to register ' + username);
  User.findOne({ username })
    .then((user) => {
      console.log(`found user ${user?.username}`);
      if (user) {
        res.status(400).json({
          message: { msgBody: 'Username is already in use', msgError: true },
        });
        return;
      }
      const newUser = new User(req.body);
      console.log('new user created', newUser);
      newUser
        .save()
        .then(() => {
          console.log('account creation successful');
          res.status(201).json({
            message: {
              msgBody: 'Account successfully created',
              msgError: false,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: { msgBody: 'Error saving user', msgError: true },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: { msgBody: 'Could not register user', msgError: true },
      });
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
