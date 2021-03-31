import { Publisher, Subjects, ChurchUpdatedEvent } from '@rhtickets/common';

export class ChurchUpdatedPublisher extends Publisher<ChurchUpdatedEvent> {
  readonly subject = Subjects.ChurchUpdated;
}