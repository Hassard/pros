import { Publisher, Subjects, ChurchCreatedEvent } from '@rhtickets/common';

export class ChurchCreatedPublisher extends Publisher<ChurchCreatedEvent> {
  readonly subject = Subjects.ChurchCreated;
}