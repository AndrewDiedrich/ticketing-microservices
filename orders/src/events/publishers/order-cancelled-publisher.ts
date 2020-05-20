import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@andrewdied-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
