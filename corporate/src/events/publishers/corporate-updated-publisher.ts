import { Publisher, Subjects, CorporateUpdatedEvent } from '@rhtickets/common';

export class CorporateUpdatedPublisher extends Publisher<CorporateUpdatedEvent> {
  readonly subject = Subjects.CorporateUpdated;
}