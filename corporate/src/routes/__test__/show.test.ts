import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the corporate is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/corporate/${id}`)
    .send()
    .expect(404);
});

it('returns the corporate if the corporate is found', async () => {
  const title = 'New one';
  const content = 'asdasd';

  const response = await request(app)
    .post('/api/corporate')
    .set('Cookie', global.signin())
    .send({
      title, content
    })
    .expect(201);

  const corporateResponse = await request(app)
    .get(`/api/corporate/${response.body.id}`)
    .send()
    .expect(200);

  expect(corporateResponse.body.title).toEqual(title);
  expect(corporateResponse.body.content).toEqual(content);
});