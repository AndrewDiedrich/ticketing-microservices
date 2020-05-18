import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  // deliverAllAvailable and setDurableName makes sure missed
  // processed events get processed after listener comes back
  // online, store in durable name
  new TicketCreatedListener(stan).listen();
});

// TERMINATE REQUEST ctrl+c or restart will tell
// subscription to close and not try to reconnect to
// subscription id
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
