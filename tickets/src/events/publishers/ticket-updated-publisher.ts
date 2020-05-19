import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@andrewdied-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
