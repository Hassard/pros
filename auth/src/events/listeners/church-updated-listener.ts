import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ChurchUpdatedEvent } from '@rhtickets/common';
import { Church, ChurchDoc } from '../../models/church';
import { queueGroupName } from './queue-group-name';

export class ChurchUpdatedListener extends Listener<ChurchUpdatedEvent> {
  readonly subject = Subjects.ChurchUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ChurchUpdatedEvent['data'], msg: Message) {
    const church = await Church.findByEvent(data);

    if (!church) {
      throw new Error('Church not found');
    }

    const { name } = data;
    church.set({ name });
    await church.save();

    msg.ack();
  }
}