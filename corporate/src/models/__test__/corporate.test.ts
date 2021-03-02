import { Corporate } from '../corporate';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a corporate
  const corporate = Corporate.build({
    title: 'Prayer 1',
    content: 'All the things',
    userId: '123'
  });

  // Save the corporate to the database
  await corporate.save();

  // fetch the corporate twice
  const firstInstance = await Corporate.findById(corporate.id);
  const secondInstance = await Corporate.findById(corporate.id);

  // make two seperate changes to the corporates we fetched
  firstInstance!.set({ content: 'First change' });
  secondInstance!.set({ content: 'Second change' });

  // save the first fetched corporate
  await firstInstance!.save();

  // save the second fetched corporate and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
  
});

it('increments the version number on multiple saves', async () => {
  const corporate = Corporate.build({
    title: 'Prayer 1',
    content: 'All the things',
    userId: '123'
  });

  await corporate.save();
  expect(corporate.version).toEqual(0);

  await corporate.save();
  expect(corporate.version).toEqual(1);

  await corporate.save();
  expect(corporate.version).toEqual(2);
});