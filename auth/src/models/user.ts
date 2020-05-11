import mongoose from 'mongoose';
import { Password } from '../services/password';
// interface that's required to make new user
interface UserAttrs {
  email: string;
  password: string;
}

// interface that describes properties that User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface that describes properties that User Doc has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// mongoose model
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  // have to call done to indicate it's done
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
// feed into mongoose to create model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
