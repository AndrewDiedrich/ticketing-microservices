import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@andrewdied-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
