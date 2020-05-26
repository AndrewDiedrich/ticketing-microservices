import { queueGroupName } from './queue-group-name';
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@andrewdied-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw an error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // marke the ticket as reserved by setting its orderid property
    ticket.set({ orderId: data.id });
    // save the ticket
    await ticket.save();
    // publish event of created
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    // ack the message
    msg.ack();
  }
}
