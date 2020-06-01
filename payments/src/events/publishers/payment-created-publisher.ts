import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@andrewdied-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
