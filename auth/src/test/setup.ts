import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

// declare so each hook has access
let mongo: any;
// hook function run before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfadsf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// run before each test, delete all collections
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// after all tests are complete stop and close mongoose db
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
