import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@andrewdied-tickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
