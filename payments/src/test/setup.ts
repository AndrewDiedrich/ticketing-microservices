import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

//declare signup function a global helper for testing
declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

// all tests use mock of nats wrapper before tests
jest.mock('../nats-wrapper');

// real mock stripe
process.env.STRIPE_KEY = 'sk_test_F32Gdvt2m78ckL6rfMvW61ra00QxplyN4U';

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
  jest.clearAllMocks();
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

global.signin = (id?: string) => {
  // build jwt payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build up session object { jwt: MY_JWT}
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON  and encdoe it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
