import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import {
  OrderCreatedEvent,
  OrderStatus,
  Listener,
} from '@andrewdied-tickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdfasdf',
  });
  await ticket.save();

  // create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdfasdfa',
    expiresAt: 'asdfghsdf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return everything
  return { listener, ticket, data, msg };
};

it('sets userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  // update the ticket
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  // GET SAME ID ORDER ID
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
