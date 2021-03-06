import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
  console.log('Starting up...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be definded');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('tickets MONGO_URI must be definded');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('tickets NATS_CLUSTER_ID must be definded');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('tickets NATS_CLIENT_ID must be definded');
  }
  if (!process.env.NATS_URL) {
    throw new Error('tickets NATS_URL must be definded');
  }

  try {
    //cluster id in nats depl file CID
    //want unique id for every instance of nats pod
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    // gracefully close nats if shutdown or interupted
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // listeners
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    // connect to mongo
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('🚀 Connected to Payments MongoDb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('🚀 Listening on port 3000');
});

start();
