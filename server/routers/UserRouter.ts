import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../schemas/UserSchema.ts';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
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

const userRouter = Router();

userRouter.get(
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
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Could not get authenticated user' });
      });
  }
);

userRouter.get('/all-users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Could not get all users' });
    });
});

userRouter.post('/register', (req, res) => {
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
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: 'Error saving user' });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Could not register user' });
    });
});

userRouter.post('/login', (req, res) => {
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

export default userRouter;
