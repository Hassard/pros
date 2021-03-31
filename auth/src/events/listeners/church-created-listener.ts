import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ChurchCreatedEvent } from '@rhtickets/common';
import { Church } from '../../models/church';
import { queueGroupName } from './queue-group-name';

export class ChurchCreatedListener extends Listener<ChurchCreatedEvent> {
  readonly subject = Subjects.ChurchCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ChurchCreatedEvent['data'], msg: Message) {
    const { id, name } = data;
    const church = Church.build({
      id, name
    });
    await church.save();

    msg.ack();
  }
}