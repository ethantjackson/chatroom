import { Schema, Document, model } from 'mongoose';
import { compare, hash } from 'bcrypt';

interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    trim: true,
    require: true,
    index: { unique: true },
  },
  password: {
    type: String,
    trim: true,
    require: true,
  },
});

UserSchema.pre(
  'save',
  function (this: IUser, next: (err?: Error | undefined) => void) {
    console.log('attempting save');
    // * Make sure you don't hash the hash
    if (!this.isModified('password')) {
      return next();
    }
    hash(this.password, 10, (err, hash) => {
      console.log('created hash', hash, err);
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
);

UserSchema.methods.comparePasswords = function (
  candidatePassword: string,
  next: (err: Error | null, same: boolean | null) => void
) {
  compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return next(err, null);
    }
    next(null, isMatch);
  });
};

export default model<IUser>('User', UserSchema);
