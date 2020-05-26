import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import {
  OrderCancelledEvent,
  OrderStatus,
  Listener,
} from '@andrewdied-tickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // create and save a ticket
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdfasdf',
  });
  ticket.set({ orderId });
  await ticket.save();

  // create fake data event
  const data: OrderCancelledEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return everything
  return { listener, ticket, data, msg, orderId };
};

it('udpate the ticket, publishes an event, and acks message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);
  // update the ticket
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
