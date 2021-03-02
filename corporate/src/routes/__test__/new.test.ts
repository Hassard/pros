import request from 'supertest';
import { app } from '../../app';
import { Corporate } from '../../models/corporate';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/corporate for post requests', async () => {
  const response = await request(app)
    .post('/api/corporate')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/corporate')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      title: '',
      content: ''
    })
    //from request-validation-error
    .expect(400);

  await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      content: 'All the things'
    })
    //from request-validation-error
    .expect(400);
});

it('returns an error if an invalid content is provided', async () => {
  await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      content: ''
    })
    //from request-validation-error
    .expect(400);

  await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd'
    })
    //from request-validation-error
    .expect(400);
});

it('creates a corporate with valid inputs', async () => {
  let corporate = await Corporate.find({});
  expect(corporate.length).toEqual(0);

  const title = 'asdasdas';

  await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      title,
      content: 'asdasd'
    })
    .expect(201);

  corporate = await Corporate.find({});
  expect(corporate.length).toEqual(1);
  expect(corporate[0].content).toEqual('asdasd');
  expect(corporate[0].title).toEqual(title);
});

it('publishes an event', async() => {
  const title = 'asdasdas';

  await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      title,
      content: 'asdasd'
    })
    .expect(201);
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();

});