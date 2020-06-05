import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up....');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be definded');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('auth MONGO_URI must be definded');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('🚀 Connected to Auth mongodb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('🚀 Listening on port 3000');
});

start();
