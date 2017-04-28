import decorateEvents from '../src/decorateEvents';

it('does not mutate the original event', () => {
  const event =  {
    start: new Date(0),
    end: new Date(100),
  };
  const newEvent = decorateEvents([event])[0];
  expect(newEvent).not.toBe(event)
});

it('can handle dates that are ISO strings', () => {
  const events = [{
    start: new Date(0).toISOString(),
    end: new Date(100).toISOString(),
  }];
  expect(decorateEvents(events)).toEqual([{
    start: new Date(0),
    end: new Date(100),
    offset: 0,
    width: 1,
  }]);
});

it('does not add overlap hints when no overlap exists', () => {
  const overlapped = decorateEvents([
    {
      start: new Date(0),
      end: new Date(100),
    },
    {
      start: new Date(101),
      end: new Date(200),
    },
  ]);
  expect(overlapped.length).toEqual(2);
  expect(overlapped[0]).toEqual({
    start: new Date(0),
    end: new Date(100),
    offset: 0,
    width: 1,
  });
  expect(overlapped[1]).toEqual({
    start: new Date(101),
    end: new Date(200),
    offset: 0,
    width: 1,
  });
});

it('adds overlap hints when overlaps exist', () => {
  const overlapped = decorateEvents([
    {
      start: new Date(0),
      end: new Date(300),
    },
    {
      start: new Date(101),
      end: new Date(240),
    },
    {
      start: new Date(150),
      end: new Date(220),
    },
    {
      start: new Date(250),
      end: new Date(350),
    },
    {
      start: new Date(400),
      end: new Date(500),
    },
    {
      start: new Date(500),
      end: new Date(600),
    },
    {
      start: new Date(500),
      end: new Date(600),
      allDay: true, // Should not be grouped
    },
  ]);
  expect(overlapped.length).toEqual(7);
  expect(overlapped[0]).toEqual({
    start: new Date(0),
    end: new Date(300),
    width: 1/3,
    offset: 0,
  });
  expect(overlapped[1]).toEqual({
    start: new Date(101),
    end: new Date(240),
    width: 1/3,
    offset: 1/3,
  });
  expect(overlapped[2]).toEqual({
    start: new Date(150),
    end: new Date(220),
    width: 1/3,
    offset: 2/3,
  });
  expect(overlapped[3]).toEqual({
    start: new Date(250),
    end: new Date(350),
    width: 2/3,
    offset: 1/3,
  });
  expect(overlapped[4]).toEqual({
    start: new Date(400),
    end: new Date(500),
    width: 1,
    offset: 0,
  });
  expect(overlapped[5]).toEqual({
    start: new Date(500),
    end: new Date(600),
    width: 1,
    offset: 0,
  });
});
