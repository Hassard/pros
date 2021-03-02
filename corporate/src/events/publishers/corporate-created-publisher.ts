import { Publisher, Subjects, CorporateCreatedEvent } from '@rhtickets/common';

export class CorporateCreatedPublisher extends Publisher<CorporateCreatedEvent> {
  readonly subject = Subjects.CorporateCreated;
}