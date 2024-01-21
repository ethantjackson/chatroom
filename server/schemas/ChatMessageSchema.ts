import { Schema, model } from 'mongoose';

const ChatMessageSchema = new Schema({
  content: {
    type: String,
    trim: true,
    require: true,
  },
  senderUsername: {
    type: String,
    trim: true,
    require: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default model('ChatMesssage', ChatMessageSchema);
