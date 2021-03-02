import request from 'supertest';
import { app } from '../../app';

const createCorporate = () => {
  return request(app)
  .post('/api/corporate')
  .set('Cookie', global.signin())
  .send({
    title: 'asdasd',
    content: 'qwerty'
  });
}

it('can fetch a list of corporate prayers', async () => {
  await createCorporate();
  await createCorporate();
  await createCorporate();

  const response = await request(app)
    .get('/api/corporate')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});