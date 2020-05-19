import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@andrewdied-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
