import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // create instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  // save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const SecondInstance = await Ticket.findById(ticket.id);
  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  SecondInstance!.set({ price: 15 });
  // save the first fetched ticket
  await firstInstance!.save();
  // save the second fetched ticket and expect error
  try {
    await SecondInstance!.save();
  } catch (err) {
    return done();
  }
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
