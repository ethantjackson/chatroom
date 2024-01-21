import { Router } from 'express';
import ChatMessage from '../schemas/ChatMessageSchema.ts';
import User from '../schemas/UserSchema.ts';
import { AuthenticatedRequest, authenticateToken } from './UserRouter.ts';
import { startSession } from 'mongoose';

const messageRouter = Router();

messageRouter.get('/all-chat-messages', (req, res) => {
  ChatMessage.find({})
    .then((messages) => {
      res.status(200).json({ messages });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Could not get all messages' });
    });
});

messageRouter.post(
  '/create-chat-message',
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    const { content, senderUsername } = req.body;
    const newMessage = new ChatMessage({
      content,
      senderUsername,
      senderId: req.userId,
    });
    newMessage
      .save()
      .then(() => {
        res.status(201).json(newMessage);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Error creating chat' });
      });
  }
);

messageRouter.post(
  '/vote',
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    const { messageId, isUnvote, incValue } = req.body;
    try {
      const session = await startSession();
      let transactionSuccessful = true;
      let updatedChat = null;
      session.startTransaction();
      try {
        updatedChat = await ChatMessage.findOneAndUpdate(
          { _id: messageId },
          { $inc: { votes: incValue } },
          { new: true }
        ).session(session);
        if (isUnvote) {
          await User.updateOne(
            { _id: req.userId },
            {
              $pull: { upvotedChatIds: messageId, downvotedChatIds: messageId },
            }
          ).session(session);
        } else if (incValue > 0) {
          await User.updateOne(
            { _id: req.userId },
            {
              $addToSet: { upvotedChatIds: messageId },
              $pull: { downvotedChatIds: messageId },
            }
          ).session(session);
        } else if (incValue < 0) {
          await User.updateOne(
            { _id: req.userId },
            {
              $addToSet: { downvotedChatIds: messageId },
              $pull: { upvotedChatIds: messageId },
            }
          ).session(session);
        }
        await session.commitTransaction();
      } catch (err) {
        transactionSuccessful = false;
        await session.abortTransaction();
        console.log('Transaction aborted: ', err);
      } finally {
        session.endSession();
        if (!transactionSuccessful) {
          res.status(500).json({ message: 'Vote was unsuccessful' });
        } else {
          res.status(200).json({ updatedChat: updatedChat });
        }
      }
    } catch (err) {
      console.log('Session or transaction could not be started: ', err);
      res.status(500).json({ message: 'Vote was unsuccessful' });
    }
  }
);

export default messageRouter;
