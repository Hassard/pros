import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Corporate } from '../../models/corporate';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/corporates/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asddadasd',
      content: 'All the things'
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/corporates/${id}`)
    .send({
      title: 'asddadasd',
      content: 'All the things'
    })
    .expect(401);
});

it('returns a 401 if the user does not own the corporate', async () => {
  const response = await request(app)
    .post('/api/corporates')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      content: 'All the things'
    });

  await request(app)
    .put(`/api/corporates/${response.body.id}`)
    //new randomly generated id
    .set('Cookie', global.signin())
    .send({
      title: 'qwerty',
      content: 'All the things'
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or content', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/corporates')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      content: 'All the things'
    });

  await request(app)
    .put(`/api/corporates/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      content: 'All the things'
    })
    .expect(400);
  
  await request(app)
    .put(`/api/corporates/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      content: 'All the things x2'
    })
    .expect(400);
});

it('updates the corporate provided valid inputs', async () => {
  const cookie = global.signin();
  const title = 'New Title';
  const content = 'All the things'

  const response = await request(app)
    .post('/api/corporates')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      content: 'All the things 2'
    });

  await request(app)
    .put(`/api/corporates/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title,
      content: content
    })
    .expect(200);

  const corporateResponse = await request(app)
    .get(`/api/corporates/${response.body.id}`)
    .send();

  expect(corporateResponse.body.title).toEqual(title);
  expect(corporateResponse.body.content).toEqual(content);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const title = 'New Title';
  const content = 'All the things'

  const response = await request(app)
    .post('/api/corporates')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      content: 'All the things 2'
    });

  await request(app)
    .put(`/api/corporates/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title,
      content: content
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the corporate is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/corporates')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      content: 'All the things'
    });

  const corporate = await Corporate.findById(response.body.id);
  corporate!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await corporate!.save();

  await request(app)
    .put(`/api/corporates/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      content: 'All the things 2'
    })
    .expect(400);
});