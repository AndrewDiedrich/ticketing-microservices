import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listener/order-created-listener';
const start = async () => {
  console.log('Starting up...');
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

    //new listener
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
